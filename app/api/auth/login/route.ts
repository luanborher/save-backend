import { prisma } from "@/lib/prisma";
import { loginSchema } from "@/lib/validations";
import { serializeUser } from "@/lib/user";
import { generateToken } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        {
          error: "Dados inválidos",
          details: parsed.error.flatten(),
        },
        { status: 400 },
      );
    }

    const { email, password } = parsed.data;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return Response.json(
        { error: "Email ou senha inválidos" },
        { status: 401 },
      );
    }

    const passwordMatches = await bcrypt.compare(password, user.passwordHash);

    if (!passwordMatches) {
      return Response.json(
        { error: "Email ou senha inválidos" },
        { status: 401 },
      );
    }

    const token = generateToken({
      userId: user.id,
      email: user.email,
    });

    return Response.json({
      message: "Login realizado com sucesso",
      token,
      user: serializeUser(user),
    });
  } catch (error) {
    console.error("LOGIN_ERROR", error);

    return Response.json(
      { error: "Erro interno do servidor" },
      { status: 500 },
    );
  }
}
