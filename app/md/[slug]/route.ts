import { pageMarkdown } from "@/lib/agent-view";

export const revalidate = 60;

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const md = await pageMarkdown(slug);
  if (!md) return new Response("Not found", { status: 404 });
  return new Response(md, {
    headers: { "Content-Type": "text/markdown; charset=utf-8", "X-Robots-Tag": "all", Vary: "Accept" },
  });
}
