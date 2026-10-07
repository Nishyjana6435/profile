import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Contact from "@/components/Contact";
import { Arrow, Chip, Eyebrow } from "@/components/ui";
import { getPostBySlug, getSiteSettings } from "@/lib/contentful";
import { RichText, readingMinutes, richTextToPlainText } from "@/lib/richtext";
import { SITE_NAME, SITE_URL } from "@/lib/seo";

export const revalidate = 60000;

export async function generateMetadata(props: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const post = await getPostBySlug(slug);
  if (!post) return {};
  const title = `${post.fields.title} — ${SITE_NAME}`;
  const description = post.fields.excerpt || richTextToPlainText(post.fields.content).slice(0, 160);
  const url = `${SITE_URL}/blog/${post.fields.slug}`;
  const cover = post.fields.coverImage && "fields" in post.fields.coverImage ? post.fields.coverImage.fields.file?.url : undefined;
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    openGraph: { type: "article", title, description, url, siteName: SITE_NAME, publishedTime: post.fields.publishDate, images: cover ? [`https:${cover}`] : undefined },
    twitter: { card: "summary_large_image", title, description, images: cover ? [`https:${cover}`] : undefined },
  };
}

export default async function BlogPostPage(props: PageProps<"/blog/[slug]">) {
  const { slug } = await props.params;
  const [post, siteSettings] = await Promise.all([getPostBySlug(slug), getSiteSettings()]);
  if (!post) notFound();

  const cover = post.fields.coverImage && "fields" in post.fields.coverImage ? post.fields.coverImage : undefined;
  const coverUrl = cover?.fields.file?.url;
  const date = new Date(post.fields.publishDate).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  const minutes = readingMinutes(post.fields.content);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.fields.title,
    datePublished: post.fields.publishDate,
    author: { "@type": "Person", name: SITE_NAME, url: SITE_URL },
    image: coverUrl ? `https:${coverUrl}` : undefined,
    mainEntityOfPage: `${SITE_URL}/blog/${post.fields.slug}`,
    keywords: post.fields.tags?.join(", "),
  };

  return (
    <div className="flex min-h-full flex-1 flex-col bg-[#121212] text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Header />
      <main className="flex-1 px-6 pb-24 pt-14 sm:pt-20">
        <article className="mx-auto max-w-3xl">
          <nav aria-label="Breadcrumb" className="label text-neutral-500">
            <Link href="/blog" className="inline-flex items-center gap-1.5 hover:text-white">
              <Arrow className="h-3 w-3 rotate-[225deg]" /> Blog
            </Link>
          </nav>
          <div className="mt-8">
            <Eyebrow>
              {date} · {minutes} min read
            </Eyebrow>
          </div>
          <h1 className="display-sm mt-5 text-3xl leading-tight text-white sm:text-5xl">{post.fields.title}</h1>
          {post.fields.excerpt && <p className="mt-5 text-lg leading-8 text-neutral-300">{post.fields.excerpt}</p>}
          {post.fields.tags && post.fields.tags.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {post.fields.tags.map((tag) => (
                <Chip key={tag}>{tag}</Chip>
              ))}
            </div>
          )}

          {coverUrl && (
            <figure className="mt-10 overflow-hidden border hairline bg-[#161616]">
              <Image
                src={`https:${coverUrl}`}
                alt={cover?.fields.title || post.fields.title}
                width={cover?.fields.file?.details?.image?.width ?? 1600}
                height={cover?.fields.file?.details?.image?.height ?? 900}
                sizes="(min-width: 768px) 768px, 100vw"
                priority
                className="h-auto w-full"
              />
            </figure>
          )}

          <div className="mt-12 border-t hairline pt-10">
            <RichText document={post.fields.content} />
          </div>

          <footer className="mt-16 flex flex-col gap-4 border-t hairline pt-8 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-neutral-400">
              Written by <Link href="/about" className="text-white hover:underline">Nishanthan Janarthanarajah (Nishy)</Link>, founder of Agent Studio and Flows.
            </p>
            <Link href="/blog" className="label inline-flex items-center gap-1.5 text-white hover:text-brand-300">
              More posts <Arrow className="h-3 w-3" />
            </Link>
          </footer>
        </article>
      </main>
      <Contact siteSettings={siteSettings} />
    </div>
  );
}
