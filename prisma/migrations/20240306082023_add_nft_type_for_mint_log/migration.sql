/*
  Warnings:

  - You are about to drop the column `name` on the `rare_nft` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[type]` on the table `rare_nft` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `nft_type` to the `mint_custom_logs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nft_type` to the `mint_logs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `rare_nft` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "NftType" AS ENUM ('goldenAxe', 'common');

-- DropIndex
DROP INDEX "rare_nft_name_key";

-- AlterTable
ALTER TABLE "mint_custom_logs" ADD COLUMN     "nft_type" "NftType" NOT NULL;

-- AlterTable
ALTER TABLE "mint_logs" ADD COLUMN     "nft_type" "NftType" NOT NULL;

-- AlterTable
ALTER TABLE "rare_nft" DROP COLUMN "name",
ADD COLUMN     "type" "NftType" NOT NULL;

-- DropEnum
DROP TYPE "NftType";

-- CreateIndex
CREATE UNIQUE INDEX "rare_nft_type_key" ON "rare_nft"("type");
