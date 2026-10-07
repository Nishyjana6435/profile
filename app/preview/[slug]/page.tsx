import fs from "node:fs";
import path from "node:path";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Document } from "@contentful/rich-text-types";
import Header from "@/components/Header";
import { Chip, Eyebrow } from "@/components/ui";
import { RichText, readingMinutes } from "@/lib/richtext";

/** Local proofreading of posts before they go into the CMS. Reads .preview/posts.json; dev only. */
export const dynamic = "force-dynamic";

type Preview = { slug: string; title: string; excerpt: string; tags: string[]; publishDate: string; content: Document };

function load(): Preview[] {
  try {
    return JSON.parse(fs.readFileSync(path.join(process.cwd(), ".preview", "posts.json"), "utf8"));
  } catch {
    return [];
  }
}

export default async function PreviewPage(props: PageProps<"/preview/[slug]">) {
  const { slug } = await props.params;
  if (process.env.NODE_ENV === "production") notFound();
  const post = load().find((p) => p.slug === slug);
  if (!post) notFound();
  return (
    <div className="flex min-h-full flex-1 flex-col bg-[#121212] text-white">
      <Header />
      <main className="flex-1 px-6 pb-24 pt-14">
        <article className="mx-auto max-w-3xl">
          <p className="label text-brand-400">
            Preview · not in the CMS yet · <Link href="/preview" className="underline">all drafts</Link>
          </p>
          <div className="mt-6">
            <Eyebrow>{post.publishDate} · {readingMinutes(post.content)} min read</Eyebrow>
          </div>
          <h1 className="display-sm mt-5 text-3xl leading-tight sm:text-5xl">{post.title}</h1>
          <p className="mt-5 text-lg leading-8 text-neutral-300">{post.excerpt}</p>
          <div className="mt-6 flex flex-wrap gap-2">
            {post.tags.map((t) => (
              <Chip key={t}>{t}</Chip>
            ))}
          </div>
          <div className="mt-12 border-t hairline pt-10">
            <RichText document={post.content} />
          </div>
        </article>
      </main>
    </div>
  );
}
