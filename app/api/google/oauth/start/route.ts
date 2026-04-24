import { NextRequest, NextResponse } from "next/server";
import { getAuthUrl } from "@/lib/googleOAuthClient";

const OAUTH_STATE_COOKIE = "google-oauth-state";

function isLocalDevelopmentRequest(request: NextRequest) {
  return ["localhost", "127.0.0.1", "::1"].includes(request.nextUrl.hostname);
}

export async function GET(request: NextRequest) {
  if (process.env.NODE_ENV !== "development" || !isLocalDevelopmentRequest(request)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const state = crypto.randomUUID();
  const url = getAuthUrl(state);
  const response = NextResponse.redirect(url);

  response.cookies.set({
    name: OAUTH_STATE_COOKIE,
    value: state,
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    path: "/",
    maxAge: 10 * 60,
  });
  response.headers.set("Cache-Control", "no-store, max-age=0");

  return response;
}
