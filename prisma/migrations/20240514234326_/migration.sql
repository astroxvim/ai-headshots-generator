-- CreateTable
CREATE TABLE "imageGeneration" (
    "id" SERIAL NOT NULL,
    "gid" TEXT NOT NULL,
    "blobUrls" TEXT[],
    "resultUrls" TEXT[],
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "imageGeneration_pkey" PRIMARY KEY ("id")
);
