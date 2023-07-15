/*
  Warnings:

  - A unique constraint covering the columns `[beneficiaryId]` on the table `account` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "account" ADD COLUMN     "beneficiaryId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "account_beneficiaryId_key" ON "account"("beneficiaryId");

-- AddForeignKey
ALTER TABLE "account" ADD CONSTRAINT "account_beneficiaryId_fkey" FOREIGN KEY ("beneficiaryId") REFERENCES "account"("id") ON DELETE SET NULL ON UPDATE CASCADE;
