import { AppError } from "./app-error";

export function handleError(error: unknown) {
  console.error("❌ ERROR:", error);

  if (error instanceof AppError) {
    return Response.json(
      {
        error: error.message,
        code: error.code,
      },
      { status: error.statusCode },
    );
  }

  return Response.json(
    {
      error: "Erro interno do servidor",
      code: "INTERNAL_SERVER_ERROR",
    },
    { status: 500 },
  );
}
