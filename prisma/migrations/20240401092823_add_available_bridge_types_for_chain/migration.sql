/*
  Warnings:

  - You are about to drop the column `visible` on the `chains` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "BridgeType" AS ENUM ('layer_zero', 'hyperlane');

-- AlterTable
ALTER TABLE "chains" DROP COLUMN "visible",
ADD COLUMN     "available_network_types" "BridgeType"[] DEFAULT ARRAY[]::"BridgeType"[],
ADD COLUMN     "hyperlane_chain" INTEGER;

-- AlterTable
ALTER TABLE "nfts" ADD COLUMN     "bridge_type" "BridgeType" DEFAULT 'layer_zero';
