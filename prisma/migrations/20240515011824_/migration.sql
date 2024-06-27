/*
  Warnings:

  - A unique constraint covering the columns `[gid]` on the table `imageGeneration` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[gid]` on the table `images` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "imageGeneration_gid_key" ON "imageGeneration"("gid");

-- CreateIndex
CREATE UNIQUE INDEX "images_gid_key" ON "images"("gid");
