/*
  Warnings:

  - You are about to drop the column `visible` on the `chains` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "NetworkType" AS ENUM ('layer_zero', 'hyperlane');

-- AlterTable
ALTER TABLE "chains" DROP COLUMN "visible",
ADD COLUMN     "available_network_types" "NetworkType"[] DEFAULT ARRAY[]::"NetworkType"[];
