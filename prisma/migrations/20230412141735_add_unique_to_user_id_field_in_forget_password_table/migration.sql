/*
  Warnings:

  - A unique constraint covering the columns `[user_id]` on the table `forget_passwords` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "forget_passwords_user_id_key" ON "forget_passwords"("user_id");
