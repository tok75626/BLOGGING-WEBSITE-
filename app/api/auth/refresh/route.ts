import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { verifyRefreshToken, signAccessToken, setAuthCookies } from "@/lib/auth";

export async function POST() {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("refresh_token")?.value;

    if (!refreshToken) {
      return NextResponse.json({ error: "No refresh token" }, { status: 401 });
    }

    const payload = verifyRefreshToken(refreshToken);
    if (!payload) {
      return NextResponse.json({ error: "Invalid refresh token" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
    });

    if (!user || user.refreshToken !== refreshToken) {
      return NextResponse.json({ error: "Token mismatch or user not found" }, { status: 401 });
    }

    const newAccessToken = signAccessToken({ userId: user.id, email: user.email });
    
    // We could also rotate the refresh token here for better security
    await setAuthCookies(newAccessToken, refreshToken);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
