import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { postSchema } from "@/lib/validations";
import { cookies } from "next/headers";
import { verifyAccessToken } from "@/lib/auth";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const post = await prisma.post.findFirst({
      where: {
        OR: [{ id: params.id }, { slug: params.id }],
      },
      include: {
        author: { select: { name: true, email: true } },
        tags: true,
        category: true,
      },
    });

    if (!post) return NextResponse.json({ error: "Post not found" }, { status: 404 });

    return NextResponse.json(post);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const payload = verifyAccessToken(token);
    if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const post = await prisma.post.findUnique({ where: { id: params.id } });
    if (!post) return NextResponse.json({ error: "Post not found" }, { status: 404 });
    if (post.authorId !== payload.userId) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const body = await req.json();
    const validated = postSchema.parse(body);

    const updatedPost = await prisma.post.update({
      where: { id: params.id },
      data: {
        title: validated.title,
        content: validated.content,
        summary: validated.summary,
        published: validated.published,
        categoryId: validated.categoryId,
        tags: {
          set: [], // Clear existing relations
          connectOrCreate: validated.tags?.map(tag => ({
            where: { name: tag },
            create: { name: tag },
          })),
        },
      },
      include: { tags: true, category: true },
    });

    return NextResponse.json(updatedPost);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const payload = verifyAccessToken(token);
    if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const post = await prisma.post.findUnique({ where: { id: params.id } });
    if (!post) return NextResponse.json({ error: "Post not found" }, { status: 404 });
    if (post.authorId !== payload.userId) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    await prisma.post.delete({ where: { id: params.id } });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
