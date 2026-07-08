-- AlterEnum
ALTER TYPE "IssueEventType" ADD VALUE 'START_DATE_CHANGE';

-- AlterTable
ALTER TABLE "Issue" ADD COLUMN     "startDate" TIMESTAMP(3);
