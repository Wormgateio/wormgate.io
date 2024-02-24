-- CreateTable
CREATE TABLE "refuel_logs" (
    "id" TEXT NOT NULL,
    "balance_log_id" TEXT NOT NULL,
    "transaction_hash" TEXT NOT NULL,

    CONSTRAINT "refuel_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "refuel_logs_balance_log_id_key" ON "refuel_logs"("balance_log_id");

-- AddForeignKey
ALTER TABLE "refuel_logs" ADD CONSTRAINT "refuel_logs_balance_log_id_fkey" FOREIGN KEY ("balance_log_id") REFERENCES "balance_logs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
