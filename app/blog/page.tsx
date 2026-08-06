import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Contact from "@/components/Contact";
import { getPosts, getSiteSettings } from "@/lib/contentful";
import { SITE_NAME, SITE_URL } from "@/lib/seo";

export const revalidate = 60000;

export async function generateMetadata(): Promise<Metadata> {
  const title = `Blog — ${SITE_NAME}`;
  const description =
    "Writing on full stack development, technical leadership, Next.js, Contentful, and SEO engineering from Nishanthan Janarthanarajah.";
  const url = `${SITE_URL}/blog`;

  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    openGraph: { type: "website", title, description, url, siteName: SITE_NAME },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function BlogPage() {
  const [posts, siteSettings] = await Promise.all([getPosts(), getSiteSettings()]);

  return (
    <div className="flex min-h-full flex-1 flex-col bg-[#0a0514] text-white">
      <Header />
      <main className="flex-1 px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-3xl font-semibold text-white sm:text-4xl">Blog</h1>

          {posts.length === 0 ? (
            <p className="mt-6 text-sm text-white/60">No posts yet — check back soon.</p>
          ) : (
            <div className="mt-10 grid gap-4">
              {posts.map((post) => (
                <Link
                  key={post.sys.id}
                  href={`/blog/${post.fields.slug}`}
                  className="rounded-2xl border border-white/5 bg-gradient-to-br from-violet-900/40 to-[#1a0f38] p-6 transition-colors hover:border-violet-400/40"
                >
                  <p className="text-xs uppercase tracking-wide text-white/40">
                    {new Date(post.fields.publishDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                  <h2 className="mt-2 text-xl font-semibold text-white">
                    {post.fields.title}
                  </h2>
                  {post.fields.excerpt && (
                    <p className="mt-2 text-sm leading-6 text-white/60">
                      {post.fields.excerpt}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
      <Contact siteSettings={siteSettings} />
    </div>
  );
}
