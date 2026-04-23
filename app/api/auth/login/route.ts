import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";
import { loginSchema } from "@/lib/validations";
import { signAccessToken, signRefreshToken, setAuthCookies } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validated = loginSchema.parse(body);

    const user = await prisma.user.findUnique({
      where: { email: validated.email },
    });

    if (!user || !(await bcrypt.compare(validated.password, user.password))) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const accessToken = signAccessToken({ userId: user.id, email: user.email });
    const refreshToken = signRefreshToken({ userId: user.id, email: user.email });

    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken },
    });

    await setAuthCookies(accessToken, refreshToken);

    return NextResponse.json({
      user: { id: user.id, email: user.email, name: user.name },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
