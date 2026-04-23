import { NextRequest, NextResponse } from "next/server";
import { getOAuthClient } from "@/lib/googleOAuthClient";

const OAUTH_STATE_COOKIE = "google-oauth-state";

function isLocalDevelopmentRequest(request: NextRequest) {
  return ["localhost", "127.0.0.1", "::1"].includes(request.nextUrl.hostname);
}

export async function GET(request: NextRequest) {
  if (process.env.NODE_ENV !== "development" || !isLocalDevelopmentRequest(request)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const storedState = request.cookies.get(OAUTH_STATE_COOKIE)?.value;

  if (!code || !state || !storedState || state !== storedState) {
    return NextResponse.json({ error: "Invalid OAuth callback state" }, { status: 400 });
  }

  try {
    const client = getOAuthClient();
    const { tokens } = await client.getToken(code);
    const response = NextResponse.json(
      {
        message: "OAuth success. Copy the refresh_token into .env.local",
        refresh_token: tokens.refresh_token || null,
      },
      {
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      }
    );

    response.cookies.set({
      name: OAUTH_STATE_COOKIE,
      value: "",
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      path: "/",
      maxAge: 0,
    });

    return response;
  } catch (error) {
    console.error("OAuth callback error:", error);
    return NextResponse.json({ error: "OAuth exchange failed" }, { status: 500 });
  }
}
