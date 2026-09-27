import { getAgentView } from "@/lib/agent-view";

export const revalidate = 60;

export async function GET() {
  const view = await getAgentView();
  return Response.json(
    { "@context": "https://schema.org", ...view },
    { headers: { "Cache-Control": "public, max-age=60, s-maxage=300", "X-Robots-Tag": "all", "Access-Control-Allow-Origin": "*" } },
  );
}
