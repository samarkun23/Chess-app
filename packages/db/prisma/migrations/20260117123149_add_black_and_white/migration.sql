/*
  Warnings:

  - You are about to drop the column `ownerId` on the `Game` table. All the data in the column will be lost.
  - You are about to drop the column `player1` on the `Game` table. All the data in the column will be lost.
  - You are about to drop the column `player2` on the `Game` table. All the data in the column will be lost.
  - You are about to drop the column `winner` on the `Game` table. All the data in the column will be lost.
  - Added the required column `blackId` to the `Game` table without a default value. This is not possible if the table is not empty.
  - Added the required column `whiteId` to the `Game` table without a default value. This is not possible if the table is not empty.
  - Added the required column `winnerId` to the `Game` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Game" DROP CONSTRAINT "Game_ownerId_fkey";

-- AlterTable
ALTER TABLE "Game" DROP COLUMN "ownerId",
DROP COLUMN "player1",
DROP COLUMN "player2",
DROP COLUMN "winner",
ADD COLUMN     "blackId" INTEGER NOT NULL,
ADD COLUMN     "result" "gameResult",
ADD COLUMN     "whiteId" INTEGER NOT NULL,
ADD COLUMN     "winnerId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_whiteId_fkey" FOREIGN KEY ("whiteId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_blackId_fkey" FOREIGN KEY ("blackId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
