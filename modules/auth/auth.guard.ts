import { verifyToken } from "@/lib/auth";
import { userRepository } from "@/modules/users/user.repository";
import { AppError } from "@/lib/errors/app-error";

export class AuthError extends AppError {
  constructor(message: string, code: string) {
    super(message, 401, code);
  }
}

export function extractBearerToken(request: Request) {
  const authHeader = request.headers.get("authorization");

  if (!authHeader) {
    throw new AuthError("Token não enviado", "TOKEN_NOT_PROVIDED");
  }

  if (!authHeader.startsWith("Bearer ")) {
    throw new AuthError("Formato do token inválido", "INVALID_TOKEN_FORMAT");
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    throw new AuthError("Token não enviado", "TOKEN_NOT_PROVIDED");
  }

  return token;
}

export async function getAuthenticatedUser(request: Request) {
  const token = extractBearerToken(request);

  let payload;

  try {
    payload = verifyToken(token);
  } catch {
    throw new AuthError(
      "Token inválido ou expirado",
      "INVALID_OR_EXPIRED_TOKEN",
    );
  }

  const user = await userRepository.findById(payload.userId);

  if (!user) {
    throw new AuthError("Usuário não encontrado", "USER_NOT_FOUND");
  }

  return user;
}
