-- Deleting a user should also delete their own notifications. Previously this FK was
-- ON DELETE RESTRICT, which made user deletion fail with a foreign key constraint error
-- whenever that user had any notification (e.g. an "assigned to you" notification),
-- the same class of bug fixed earlier for Project -> Issue deletion.
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_userId_fkey";
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
