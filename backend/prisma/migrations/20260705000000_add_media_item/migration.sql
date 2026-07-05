-- CreateTable
CREATE TABLE "MediaItem" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'IMAGE',
    "order" INTEGER NOT NULL DEFAULT 0,
    "contentId" INTEGER,
    "topicId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MediaItem_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MediaItem" ADD CONSTRAINT "MediaItem_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "Content"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MediaItem" ADD CONSTRAINT "MediaItem_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "ForumTopic"("id") ON DELETE CASCADE ON UPDATE CASCADE;
