/*
  Warnings:

  - A unique constraint covering the columns `[token]` on the table `forget_passwords` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "forget_passwords_token_key" ON "forget_passwords"("token");
