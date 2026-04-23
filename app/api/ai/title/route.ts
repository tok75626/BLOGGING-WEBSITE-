import { NextResponse } from "next/server";
import { generateTitle } from "@/services/openai";
import { cookies } from "next/headers";
import { verifyAccessToken } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;
    if (!token || !verifyAccessToken(token)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { topic } = await req.json();
    if (!topic) return NextResponse.json({ error: "Topic is required" }, { status: 400 });

    const title = await generateTitle(topic);
    return NextResponse.json({ title });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
