-- Deleting a project should also delete its issues (and their labels/events/attachments,
-- which already cascade from Issue). Previously this FK was ON DELETE RESTRICT, which made
-- project deletion fail with a foreign key constraint error whenever the project had issues,
-- even though the UI's delete confirmation says issues will be removed too.
ALTER TABLE "Issue" DROP CONSTRAINT "Issue_projectId_fkey";
ALTER TABLE "Issue" ADD CONSTRAINT "Issue_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
