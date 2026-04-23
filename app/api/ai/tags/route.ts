import { NextResponse } from "next/server";
import { generateTags } from "@/services/openai";
import { cookies } from "next/headers";
import { verifyAccessToken } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;
    if (!token || !verifyAccessToken(token)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { content } = await req.json();
    if (!content) return NextResponse.json({ error: "Content is required" }, { status: 400 });

    const tags = await generateTags(content);
    return NextResponse.json({ tags });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
