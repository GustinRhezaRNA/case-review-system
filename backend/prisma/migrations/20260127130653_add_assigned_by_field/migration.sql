-- AlterTable
ALTER TABLE "cases" ADD COLUMN     "assigned_by" UUID;

-- CreateIndex
CREATE INDEX "cases_assigned_by_idx" ON "cases"("assigned_by");

-- AddForeignKey
ALTER TABLE "cases" ADD CONSTRAINT "cases_assigned_by_fkey" FOREIGN KEY ("assigned_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
