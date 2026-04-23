import { NextResponse } from "next/server";
import { generateBlogContent } from "@/services/openai";
import { aiContentSchema } from "@/lib/validations";
import { cookies } from "next/headers";
import { verifyAccessToken } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;
    if (!token || !verifyAccessToken(token)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validated = aiContentSchema.parse(body);

    const content = await generateBlogContent(validated.topic, validated.tone, validated.length);
    return NextResponse.json({ content });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
