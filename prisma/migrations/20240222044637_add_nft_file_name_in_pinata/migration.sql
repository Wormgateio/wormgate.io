-- AlterTable
ALTER TABLE "nfts" ADD COLUMN     "chain_id_to_first_bridge" TEXT,
ADD COLUMN     "pinata_file_name" TEXT,
ALTER COLUMN "pinata_json_hash" DROP NOT NULL;
