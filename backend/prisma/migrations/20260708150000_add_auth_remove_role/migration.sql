-- AlterTable: add passwordHash with temporary default (existing rows get placeholder, seed.js will overwrite all users anyway)
ALTER TABLE "User" ADD COLUMN "passwordHash" TEXT NOT NULL DEFAULT '';
ALTER TABLE "User" ALTER COLUMN "passwordHash" DROP DEFAULT;

-- Drop role column and enum
ALTER TABLE "User" DROP COLUMN "role";
DROP TYPE "UserRole";
