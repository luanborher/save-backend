import { verifyToken } from "@/lib/auth";
import { userRepository } from "@/modules/users/user.repository";

export class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthError";
  }
}

export function extractBearerToken(request: Request) {
  const authHeader = request.headers.get("authorization");

  if (!authHeader) {
    throw new AuthError("TOKEN_NOT_PROVIDED");
  }

  if (!authHeader.startsWith("Bearer ")) {
    throw new AuthError("INVALID_TOKEN_FORMAT");
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    throw new AuthError("TOKEN_NOT_PROVIDED");
  }

  return token;
}

export async function getAuthenticatedUser(request: Request) {
  const token = extractBearerToken(request);

  let payload;

  try {
    payload = verifyToken(token);
  } catch {
    throw new AuthError("INVALID_OR_EXPIRED_TOKEN");
  }

  const user = await userRepository.findById(payload.userId);

  if (!user) {
    throw new AuthError("USER_NOT_FOUND");
  }

  return user;
}
