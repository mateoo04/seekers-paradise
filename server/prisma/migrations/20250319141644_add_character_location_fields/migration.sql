/*
  Warnings:

  - Added the required column `xPercent` to the `Character` table without a default value. This is not possible if the table is not empty.
  - Added the required column `yPercent` to the `Character` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Character" ADD COLUMN     "xPercent" DECIMAL(65,30) NOT NULL,
ADD COLUMN     "yPercent" DECIMAL(65,30) NOT NULL;
