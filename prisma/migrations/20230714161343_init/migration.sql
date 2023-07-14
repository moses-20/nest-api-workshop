-- CreateTable
CREATE TABLE "account" (
    "id" SERIAL NOT NULL,
    "sim" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "airtime" TEXT NOT NULL,

    CONSTRAINT "account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "airtime" (
    "id" SERIAL NOT NULL,
    "serial" INTEGER NOT NULL,
    "code" TEXT NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "airtime_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "account_sim_key" ON "account"("sim");
