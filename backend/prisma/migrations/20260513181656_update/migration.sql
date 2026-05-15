/*
  Warnings:

  - You are about to drop the column `expiryDate` on the `Poll` table. All the data in the column will be lost.
  - Added the required column `expiresAt` to the `Poll` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Poll" DROP COLUMN "expiryDate",
ADD COLUMN     "expiresAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Submission" ADD COLUMN     "isPublic" BOOLEAN NOT NULL DEFAULT false;
