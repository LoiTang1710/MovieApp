-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- AlterTable
ALTER TABLE "User" ADD COLUMN "fullName" TEXT,
ADD COLUMN "phone" TEXT,
ADD COLUMN "dateOfBirth" TIMESTAMP(3),
ADD COLUMN "gender" "Gender",
ADD COLUMN "avatarUrl" TEXT;
