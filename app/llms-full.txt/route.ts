import { agentViewMarkdown, getAgentView } from "@/lib/agent-view";

export const revalidate = 60;

export async function GET() {
  const view = await getAgentView();
  return new Response(agentViewMarkdown(view, { full: true }), {
    headers: { "Content-Type": "text/markdown; charset=utf-8", "X-Robots-Tag": "all" },
  });
}
