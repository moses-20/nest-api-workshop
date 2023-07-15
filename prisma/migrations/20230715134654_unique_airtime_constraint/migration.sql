/*
  Warnings:

  - A unique constraint covering the columns `[code,serial]` on the table `airtime` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "airtime" ADD COLUMN     "valid" BOOLEAN NOT NULL DEFAULT true;

-- CreateIndex
CREATE UNIQUE INDEX "airtime_code_serial_key" ON "airtime"("code", "serial");
