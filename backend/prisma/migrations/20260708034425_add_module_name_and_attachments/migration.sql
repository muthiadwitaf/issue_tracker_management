-- AlterTable
ALTER TABLE "Issue" ADD COLUMN     "moduleName" TEXT;

-- CreateTable
CREATE TABLE "IssueAttachment" (
    "id" SERIAL NOT NULL,
    "filename" TEXT NOT NULL,
    "originalName" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "eventId" INTEGER NOT NULL,

    CONSTRAINT "IssueAttachment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "IssueAttachment" ADD CONSTRAINT "IssueAttachment_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "IssueEvent"("id") ON DELETE CASCADE ON UPDATE CASCADE;
