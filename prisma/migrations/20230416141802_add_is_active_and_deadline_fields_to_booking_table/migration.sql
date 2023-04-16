/*
  Warnings:

  - Added the required column `deadline` to the `bookings` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "bookings" ADD COLUMN     "deadline" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true;
