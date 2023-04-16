/*
  Warnings:

  - You are about to drop the column `close_open` on the `tickets` table. All the data in the column will be lost.
  - Added the required column `date_close` to the `tickets` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "tickets" DROP COLUMN "close_open",
ADD COLUMN     "date_close" TIMESTAMP(3) NOT NULL;
