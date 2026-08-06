import type { ProfileEntry, ProjectEntry, SiteSettingsEntry } from "@/lib/contentful";
import { richTextToPlainText } from "@/lib/richtext";
import { SITE_NAME, SITE_URL } from "@/lib/seo";

export default function StructuredData({
  profile,
  siteSettings,
  projects,
}: {
  profile: ProfileEntry | null;
  siteSettings: SiteSettingsEntry | null;
  projects: ProjectEntry[];
}) {
  const fields = profile?.fields;
  const avatar = fields?.avatar && "fields" in fields.avatar ? fields.avatar : undefined;
  const avatarUrl = avatar?.fields.file?.url ? `https:${avatar.fields.file.url}` : undefined;
  const sameAs = (fields?.socialLinks ?? siteSettings?.fields.socialLinks ?? [])
    .map((link) => link.url)
    .filter(Boolean);

  const person = {
    "@type": "Person",
    "@id": `${SITE_URL}/#person`,
    name: fields?.name ?? SITE_NAME,
    url: SITE_URL,
    jobTitle: fields?.title,
    description: richTextToPlainText(fields?.bio) || undefined,
    image: avatarUrl,
    email: fields?.email ? `mailto:${fields.email}` : undefined,
    address: fields?.location
      ? { "@type": "PostalAddress", addressLocality: fields.location }
      : undefined,
    worksFor: fields?.currentCompany
      ? { "@type": "Organization", name: fields.currentCompany }
      : undefined,
    knowsAbout: fields?.skills,
    sameAs: sameAs.length > 0 ? sameAs : undefined,
  };

  const website = {
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: siteSettings?.fields.siteTitle ?? SITE_NAME,
    description: siteSettings?.fields.siteDescription,
    publisher: { "@id": `${SITE_URL}/#person` },
  };

  const profilePage = {
    "@type": "ProfilePage",
    "@id": `${SITE_URL}/#profilepage`,
    url: SITE_URL,
    mainEntity: { "@id": `${SITE_URL}/#person` },
    isPartOf: { "@id": `${SITE_URL}/#website` },
  };

  const itemList =
    projects.length > 0
      ? {
          "@type": "ItemList",
          "@id": `${SITE_URL}/#projects`,
          itemListElement: projects.map((project, index) => ({
            "@type": "ListItem",
            position: index + 1,
            item: {
              "@type": "CreativeWork",
              name: project.fields.title,
              description:
                project.fields.summary ||
                richTextToPlainText(project.fields.description) ||
                undefined,
              url: project.fields.liveUrl,
              creator: { "@id": `${SITE_URL}/#person` },
              keywords: project.fields.tags?.join(", "),
            },
          })),
        }
      : null;

  const graph = [person, website, profilePage, itemList].filter(Boolean);

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({ "@context": "https://schema.org", "@graph": graph }),
      }}
    />
  );
}
