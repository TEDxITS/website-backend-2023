/*
  Warnings:

  - A unique constraint covering the columns `[token]` on the table `account_verifications` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "account_verifications_token_key" ON "account_verifications"("token");
