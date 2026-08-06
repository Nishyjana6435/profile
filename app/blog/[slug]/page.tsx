import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Contact from "@/components/Contact";
import { getPostBySlug, getSiteSettings } from "@/lib/contentful";
import { RichText, richTextToPlainText } from "@/lib/richtext";
import { SITE_NAME, SITE_URL } from "@/lib/seo";

export const revalidate = 60000;

export async function generateMetadata(
  props: PageProps<"/blog/[slug]">
): Promise<Metadata> {
  const { slug } = await props.params;
  const post = await getPostBySlug(slug);

  if (!post) return {};

  const title = `${post.fields.title} — ${SITE_NAME}`;
  const description =
    post.fields.excerpt || richTextToPlainText(post.fields.content).slice(0, 160);
  const url = `${SITE_URL}/blog/${post.fields.slug}`;

  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title,
      description,
      url,
      siteName: SITE_NAME,
      publishedTime: post.fields.publishDate,
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function BlogPostPage(props: PageProps<"/blog/[slug]">) {
  const { slug } = await props.params;
  const [post, siteSettings] = await Promise.all([
    getPostBySlug(slug),
    getSiteSettings(),
  ]);

  if (!post) notFound();

  return (
    <div className="flex min-h-full flex-1 flex-col bg-[#0a0514] text-white">
      <Header />
      <main className="flex-1 px-6 py-20">
        <article className="mx-auto max-w-3xl">
          <p className="text-xs uppercase tracking-wide text-white/40">
            {new Date(post.fields.publishDate).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
          <h1 className="mt-2 text-3xl font-semibold leading-tight text-white sm:text-4xl">
            {post.fields.title}
          </h1>

          {post.fields.tags && post.fields.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {post.fields.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-white/15 px-3 py-1 text-xs text-white/60"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="mt-8 text-sm leading-7 text-white/70">
            <RichText document={post.fields.content} />
          </div>
        </article>
      </main>
      <Contact siteSettings={siteSettings} />
    </div>
  );
}
