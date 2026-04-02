ALTER TABLE "List"
ADD COLUMN IF NOT EXISTS "iconNumber" INTEGER NOT NULL DEFAULT 1;

DO $$
BEGIN
	IF NOT EXISTS (
		SELECT 1
		FROM pg_constraint
		WHERE conname = 'List_iconNumber_check'
	) THEN
		ALTER TABLE "List"
		ADD CONSTRAINT "List_iconNumber_check"
		CHECK ("iconNumber" IN (1, 2, 3, 4, 5));
	END IF;
END
$$;
