import {
  getExperienceItems,
  getFeaturedProjects,
  getProfile,
} from "@/lib/contentful";
import { richTextToPlainText } from "@/lib/richtext";
import { SITE_NAME, SITE_URL } from "@/lib/seo";

export const revalidate = 60;

export async function GET() {
  const [profile, experienceItems, projects] = await Promise.all([
    getProfile(),
    getExperienceItems(),
    getFeaturedProjects(),
  ]);
  const fields = profile?.fields;
  const name = fields?.name ?? SITE_NAME;
  const bio = richTextToPlainText(fields?.bio);

  const lines: string[] = [];
  lines.push(`# ${name}`);
  lines.push("");
  if (fields?.title) {
    const role = fields.currentCompany
      ? `${fields.title} at ${fields.currentCompany}`
      : fields.title;
    lines.push(`> ${role}`);
    lines.push("");
  }
  if (bio) {
    lines.push(bio);
    lines.push("");
  }

  if (fields?.skills && fields.skills.length > 0) {
    lines.push("## Skills");
    lines.push("");
    lines.push(fields.skills.join(", "));
    lines.push("");
  }

  if (experienceItems.length > 0) {
    lines.push("## Experience");
    lines.push("");
    for (const item of experienceItems) {
      lines.push(`- **${item.fields.title}**: ${item.fields.description}`);
    }
    lines.push("");
  }

  if (projects.length > 0) {
    lines.push("## Projects");
    lines.push("");
    for (const project of projects) {
      const description =
        project.fields.summary || richTextToPlainText(project.fields.description);
      const link = project.fields.liveUrl ? ` (${project.fields.liveUrl})` : "";
      lines.push(`- **${project.fields.title}**${link}: ${description}`);
    }
    lines.push("");
  }

  lines.push("## Contact");
  lines.push("");
  if (fields?.email) lines.push(`- Email: ${fields.email}`);
  for (const link of fields?.socialLinks ?? []) {
    lines.push(`- ${link.platform}: ${link.url}`);
  }
  lines.push(`- Website: ${SITE_URL}`);

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
}
