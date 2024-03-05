-- CreateEnum
CREATE TYPE "RareNftName" AS ENUM ('goldAxe');

-- CreateTable
CREATE TABLE "rare_nft" (
    "id" SERIAL NOT NULL,
    "name" "RareNftName" NOT NULL,
    "mint_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "rare_nft_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "rare_nft_name_key" ON "rare_nft"("name");
