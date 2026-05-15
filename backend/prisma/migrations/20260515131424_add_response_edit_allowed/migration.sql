/*
  Warnings:

  - You are about to drop the column `isPublic` on the `Submission` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Poll" ADD COLUMN     "isAllowedToEditAfterSubmission" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Submission" DROP COLUMN "isPublic";
