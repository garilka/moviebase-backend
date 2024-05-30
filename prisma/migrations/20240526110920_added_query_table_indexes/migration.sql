-- CreateIndex
CREATE INDEX "query_index" ON "Query"("query");

-- CreateIndex
CREATE INDEX "expired_at_index" ON "Query"("expiredAt");
