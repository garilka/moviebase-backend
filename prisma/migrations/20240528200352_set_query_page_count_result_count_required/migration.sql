/*
  Warnings:

  - Made the column `pageCount` on table `Query` required. This step will fail if there are existing NULL values in that column.
  - Made the column `resultCount` on table `Query` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Query" ALTER COLUMN "pageCount" SET NOT NULL,
ALTER COLUMN "resultCount" SET NOT NULL;
