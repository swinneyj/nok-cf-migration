import { NextResponse } from "next/server";
import { getAuthUrl } from "@/lib/googleOAuthClient";

export async function GET() {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const url = getAuthUrl();
  return NextResponse.redirect(url);
}
