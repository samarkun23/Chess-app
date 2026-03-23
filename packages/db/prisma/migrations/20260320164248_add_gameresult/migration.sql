/*
  Warnings:

  - The values [WIN,LOSS] on the enum `gameResult` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "gameResult_new" AS ENUM ('WHITE_WIN', 'BLACK_WIN', 'DRAW');
ALTER TABLE "Game" ALTER COLUMN "result" TYPE "gameResult_new" USING ("result"::text::"gameResult_new");
ALTER TYPE "gameResult" RENAME TO "gameResult_old";
ALTER TYPE "gameResult_new" RENAME TO "gameResult";
DROP TYPE "public"."gameResult_old";
COMMIT;
