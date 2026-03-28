import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import { serializeUser } from "@/lib/user";

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return Response.json({ error: "Token não enviado" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];

    const payload = verifyToken(token);

    const user = await prisma.user.findUnique({
      where: {
        id: payload.userId,
      },
    });

    if (!user) {
      return Response.json(
        { error: "Usuário não encontrado" },
        { status: 404 },
      );
    }

    return Response.json(serializeUser(user));
  } catch (error) {
    console.error("ME_ERROR", error);

    return Response.json(
      { error: "Token inválido ou expirado" },
      { status: 401 },
    );
  }
}
