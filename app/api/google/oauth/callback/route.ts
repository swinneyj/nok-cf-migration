import { NextRequest, NextResponse } from "next/server";
import { getOAuthClient } from "@/lib/googleOAuthClient";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.json({ error: "Missing code" }, { status: 400 });
  }

  try {
    const client = getOAuthClient();
    const { tokens } = await client.getToken(code);

    return NextResponse.json({
      message: "OAuth success. Copy the refresh_token into .env.local",
      refresh_token: tokens.refresh_token || null,
      access_token: tokens.access_token || null,
      expiry_date: tokens.expiry_date || null,
      scope: tokens.scope || null,
      token_type: tokens.token_type || null,
    });
  } catch (error) {
    console.error("OAuth callback error:", error);
    return NextResponse.json({ error: "OAuth exchange failed" }, { status: 500 });
  }
}