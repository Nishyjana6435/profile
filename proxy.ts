import { NextResponse, type NextRequest } from "next/server";

/**
 * Agent-friendly delivery without cloaking: every visitor gets the same HTML.
 * - Link headers advertise the machine-readable twins on every marketing page.
 * - A client that explicitly prefers `text/markdown` over `text/html` is
 *   rewritten to the markdown twin (standard content negotiation).
 */
const MARKDOWN_TWINS: Record<string, string> = {
  "/": "/md/home",
  "/flows": "/md/flows",
  "/agent-studio": "/md/agent-studio",
  "/build-ai-system-for-your-business": "/md/build-ai-system-for-your-business",
  "/ai-engineer-sri-lanka": "/md/ai-engineer-sri-lanka",
  "/for-agents": "/md/for-agents",
};

function prefersMarkdown(accept: string): boolean {
  if (!accept.includes("text/markdown")) return false;
  const q = (type: string) => {
    const m = accept.match(new RegExp(`${type.replace("/", "\\/")}\\s*(?:;\\s*q=([0-9.]+))?`));
    if (!m) return 0;
    return m[1] ? parseFloat(m[1]) : 1;
  };
  return q("text/markdown") > q("text/html");
}

export function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const twin = MARKDOWN_TWINS[path];
  if (!twin) return NextResponse.next();

  const accept = request.headers.get("accept") ?? "";
  const response = prefersMarkdown(accept)
    ? NextResponse.rewrite(new URL(twin, request.url))
    : NextResponse.next();

  response.headers.set(
    "Link",
    [
      `<${twin}>; rel="alternate"; type="text/markdown"`,
      `</agent.json>; rel="alternate"; type="application/json"`,
      `</llms.txt>; rel="alternate"; type="text/markdown"; title="llms.txt"`,
      `</for-agents>; rel="related"; title="Agent view"`,
    ].join(", "),
  );
  response.headers.append("Vary", "Accept");
  return response;
}

export const config = {
  matcher: ["/", "/flows", "/agent-studio", "/build-ai-system-for-your-business", "/ai-engineer-sri-lanka", "/for-agents"],
};
