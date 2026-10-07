import fs from "node:fs";
import path from "node:path";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";

export const dynamic = "force-dynamic";

export default function PreviewIndex() {
  if (process.env.NODE_ENV === "production") notFound();
  let posts: { slug: string; title: string }[] = [];
  try {
    posts = JSON.parse(fs.readFileSync(path.join(process.cwd(), ".preview", "posts.json"), "utf8"));
  } catch {}
  return (
    <div className="flex min-h-full flex-1 flex-col bg-[#121212] text-white">
      <Header />
      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-16">
        <p className="label text-brand-400">Drafts waiting for the CMS</p>
        <ul className="mt-6 border-t hairline">
          {posts.map((p) => (
            <li key={p.slug} className="border-b hairline py-4">
              <Link href={`/preview/${p.slug}`} className="display-sm text-xl hover:text-brand-300">{p.title}</Link>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
