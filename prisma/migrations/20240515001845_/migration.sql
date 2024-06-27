/*
  Warnings:

  - You are about to drop the column `resultUrls` on the `imageGeneration` table. All the data in the column will be lost.
  - Added the required column `count` to the `imageGeneration` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "imageGeneration" DROP COLUMN "resultUrls",
ADD COLUMN     "count" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "images" (
    "id" SERIAL NOT NULL,
    "gid" TEXT NOT NULL,
    "blob" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "images_pkey" PRIMARY KEY ("id")
);
