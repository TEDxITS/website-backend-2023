/*
  Warnings:

  - Added the required column `person_name` to the `payments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "payments" ADD COLUMN     "person_name" TEXT NOT NULL;
