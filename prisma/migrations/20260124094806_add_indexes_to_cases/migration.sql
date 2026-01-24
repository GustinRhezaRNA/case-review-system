-- CreateIndex
CREATE INDEX "cases_created_by_idx" ON "cases"("created_by");

-- CreateIndex
CREATE INDEX "cases_assigned_to_idx" ON "cases"("assigned_to");

-- CreateIndex
CREATE INDEX "cases_status_id_idx" ON "cases"("status_id");

-- CreateIndex
CREATE INDEX "cases_created_at_idx" ON "cases"("created_at");
