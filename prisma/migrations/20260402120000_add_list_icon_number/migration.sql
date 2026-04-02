ALTER TABLE "List"
ADD COLUMN "iconNumber" INTEGER NOT NULL DEFAULT 1;

ALTER TABLE "List"
ADD CONSTRAINT "List_iconNumber_check"
CHECK ("iconNumber" IN (1, 2, 3, 4, 5));
