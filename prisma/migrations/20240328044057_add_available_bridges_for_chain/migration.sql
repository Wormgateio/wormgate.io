/*
  Warnings:

  - You are about to drop the column `visible` on the `chains` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "Bridge" AS ENUM ('LayerZero', 'Hyperlane');

-- AlterTable
ALTER TABLE "chains" DROP COLUMN "visible",
ADD COLUMN     "available_bridges" "Bridge"[] DEFAULT ARRAY[]::"Bridge"[];
