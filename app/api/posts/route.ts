import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { postSchema } from "@/lib/validations";
import { cookies } from "next/headers";
import { verifyAccessToken } from "@/lib/auth";

// Helper for slug generation
function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-");
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const search = searchParams.get("search") || "";
    const limit = 10;
    const skip = (page - 1) * limit;

    const posts = await prisma.post.findMany({
      where: {
        published: true,
        OR: [
          { title: { contains: search, mode: "insensitive" } },
          { content: { contains: search, mode: "insensitive" } },
        ],
      },
      include: {
        author: { select: { name: true, email: true } },
        tags: true,
        category: true,
      },
      orderBy: { createdAt: "desc" },
      take: limit,
      skip,
    });

    const total = await prisma.post.count({
      where: {
        published: true,
        OR: [
          { title: { contains: search, mode: "insensitive" } },
          { content: { contains: search, mode: "insensitive" } },
        ],
      },
    });

    return NextResponse.json({
      posts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const payload = verifyAccessToken(token);
    if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const validated = postSchema.parse(body);

    let slug = slugify(validated.title);
    
    // Check for slug uniqueness
    const existingPost = await prisma.post.findUnique({ where: { slug } });
    if (existingPost) {
      slug = `${slug}-${Date.now()}`;
    }

    const post = await prisma.post.create({
      data: {
        title: validated.title,
        slug,
        content: validated.content,
        summary: validated.summary,
        published: validated.published,
        authorId: payload.userId,
        categoryId: validated.categoryId,
        tags: {
          connectOrCreate: validated.tags?.map(tag => ({
            where: { name: tag },
            create: { name: tag },
          })),
        },
      },
      include: { tags: true, category: true },
    });

    return NextResponse.json(post);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
