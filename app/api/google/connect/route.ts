import { NextRequest, NextResponse } from "next/server";

/** One-time: send the site owner to Google consent so a refresh token can be minted. Guarded by a key. */
export async function GET(request: NextRequest) {
  const key = request.nextUrl.searchParams.get("key");
  const expected = process.env.BOOKING_ADMIN_KEY || process.env.CONTENTFUL_REVALIDATE_SECRET;
  if (!expected || key !== expected) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const id = process.env.GOOGLE_CLIENT_ID;
  if (!id) return NextResponse.json({ error: "GOOGLE_CLIENT_ID is not set" }, { status: 500 });
  const redirect = `${request.nextUrl.origin}/api/google/callback`;
  const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  url.search = new URLSearchParams({ client_id: id, redirect_uri: redirect, response_type: "code", access_type: "offline", prompt: "consent", include_granted_scopes: "true", scope: "https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/calendar.readonly", state: key }).toString();
  return NextResponse.redirect(url);
}
