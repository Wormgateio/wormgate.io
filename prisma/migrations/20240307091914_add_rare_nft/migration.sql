/*
  Warnings:

  - Added the required column `nft_type` to the `mint_custom_logs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nft_type` to the `mint_logs` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "NftType" AS ENUM ('goldenAxe', 'common');

-- AlterTable
ALTER TABLE "mint_custom_logs" ADD COLUMN     "nft_type" "NftType" NOT NULL;

-- AlterTable
ALTER TABLE "mint_logs" ADD COLUMN     "nft_type" "NftType" NOT NULL;

-- CreateTable
CREATE TABLE "rare_nft" (
    "id" SERIAL NOT NULL,
    "type" "NftType" NOT NULL,
    "mint_times" TIMESTAMP(3)[] DEFAULT ARRAY[]::TIMESTAMP(3)[],
    "perDay" INTEGER NOT NULL,
    "reward" INTEGER NOT NULL,

    CONSTRAINT "rare_nft_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "rare_nft_type_key" ON "rare_nft"("type");
