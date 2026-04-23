import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { clearAuthCookies, verifyAccessToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;

    if (accessToken) {
      const payload = verifyAccessToken(accessToken);
      if (payload) {
        await prisma.user.update({
          where: { id: payload.userId },
          data: { refreshToken: null },
        });
      }
    }

    await clearAuthCookies();
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
