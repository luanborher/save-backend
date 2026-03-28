import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validations";
import { serializeUser } from "@/lib/user";
import { generateToken } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        {
          error: "Dados inválidos",
          details: parsed.error.flatten(),
        },
        { status: 400 },
      );
    }

    const { name, birthDate, phone, cpf, photo, email, password } = parsed.data;

    const existingUserByEmail = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUserByEmail) {
      return Response.json(
        { error: "Já existe um usuário com esse email" },
        { status: 409 },
      );
    }

    const existingUserByCpf = await prisma.user.findUnique({
      where: { cpf },
    });

    if (existingUserByCpf) {
      return Response.json(
        { error: "Já existe um usuário com esse CPF" },
        { status: 409 },
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        birthDate: new Date(birthDate),
        phone,
        cpf,
        photo: photo || null,
        email,
        passwordHash,
      },
    });

    const token = generateToken({
      userId: user.id,
      email: user.email,
    });

    return Response.json(
      {
        message: "Usuário cadastrado com sucesso",
        token,
        user: serializeUser(user),
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("REGISTER_ERROR", error);

    return Response.json(
      { error: "Erro interno do servidor" },
      { status: 500 },
    );
  }
}
