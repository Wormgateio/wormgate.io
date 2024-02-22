-- CreateTable
CREATE TABLE "mint_custom_logs" (
    "id" TEXT NOT NULL,
    "nft_id" TEXT NOT NULL,
    "balance_log_id" TEXT NOT NULL,
    "transaction_hash" TEXT NOT NULL,

    CONSTRAINT "mint_custom_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "mint_custom_logs_balance_log_id_key" ON "mint_custom_logs"("balance_log_id");

-- AddForeignKey
ALTER TABLE "mint_custom_logs" ADD CONSTRAINT "mint_custom_logs_nft_id_fkey" FOREIGN KEY ("nft_id") REFERENCES "nfts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mint_custom_logs" ADD CONSTRAINT "mint_custom_logs_balance_log_id_fkey" FOREIGN KEY ("balance_log_id") REFERENCES "balance_logs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
