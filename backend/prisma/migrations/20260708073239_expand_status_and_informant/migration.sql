-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "IssueStatus" ADD VALUE 'TESTING';
ALTER TYPE "IssueStatus" ADD VALUE 'DEPLOY';
ALTER TYPE "IssueStatus" ADD VALUE 'TESTED';
ALTER TYPE "IssueStatus" ADD VALUE 'REVIEWED';

-- AlterTable
ALTER TABLE "Issue" ADD COLUMN     "informantName" TEXT;
