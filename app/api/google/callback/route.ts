import { NextRequest, NextResponse } from "next/server";

/** Exchanges the consent code and shows the refresh token once, for pasting into the environment. Nothing is stored. */
export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code"), state = request.nextUrl.searchParams.get("state");
  const expected = process.env.BOOKING_ADMIN_KEY || process.env.CONTENTFUL_REVALIDATE_SECRET;
  if (!code || !expected || state !== expected) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const r = await fetch("https://oauth2.googleapis.com/token", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: new URLSearchParams({ code, client_id: process.env.GOOGLE_CLIENT_ID!, client_secret: process.env.GOOGLE_CLIENT_SECRET!, redirect_uri: `${request.nextUrl.origin}/api/google/callback`, grant_type: "authorization_code" }) });
  const data = await r.json();
  if (!r.ok || !data.refresh_token) return NextResponse.json({ error: "no refresh token; make sure the consent screen asked for offline access", detail: data }, { status: 500 });
  const html = `<!doctype html><meta charset="utf-8"><title>Google connected</title><body style="font-family:system-ui;background:#121212;color:#fff;padding:40px;max-width:720px"><h1>Google Calendar connected</h1><p>Add this to the Vercel environment as <code>GOOGLE_REFRESH_TOKEN</code>, redeploy, and the booking calendar will read your availability and create events.</p><pre style="white-space:pre-wrap;word-break:break-all;background:#1a1a1a;padding:16px;border-radius:8px">${String(data.refresh_token).replace(/[<>&]/g, "")}</pre><p>This token is shown once and is not stored anywhere by this site.</p></body>`;
  return new NextResponse(html, { headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" } });
}
