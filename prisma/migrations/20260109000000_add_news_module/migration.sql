-- Add metadata to audit log
ALTER TABLE "AuditLog" ADD COLUMN "metadata" JSONB;

-- Create NewsStatus enum
DO $$ BEGIN
  CREATE TYPE "NewsStatus" AS ENUM ('QUEUED', 'PROCESSING', 'READY', 'FAILED');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Create NewsSource table
CREATE TABLE "NewsSource" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "lang" TEXT NOT NULL,
  "website" TEXT NOT NULL,
  "rssUrl" TEXT,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "NewsSource_pkey" PRIMARY KEY ("id")
);

-- Create NewsItem table
CREATE TABLE "NewsItem" (
  "id" TEXT NOT NULL,
  "sourceId" TEXT NOT NULL,
  "url" TEXT NOT NULL,
  "title" TEXT,
  "publishedAt" TIMESTAMP(3),
  "fetchedAt" TIMESTAMP(3),
  "status" "NewsStatus" NOT NULL DEFAULT 'QUEUED',
  "error" TEXT,
  "ogImageUrl" TEXT,
  "imagePath" TEXT,
  "contentHash" TEXT,
  "rawExcerpt" TEXT,
  "summaryZh" TEXT,
  "whyItMatters" TEXT,
  "tags" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  "riskFlags" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  "titleOverride" TEXT,
  "publishedAtOverride" TIMESTAMP(3),
  "summaryOverrideZh" TEXT,
  "whyItMattersOverride" TEXT,
  "tagsOverride" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  "imageOverrideUrl" TEXT,
  "isHidden" BOOLEAN NOT NULL DEFAULT false,
  "isFeatured" BOOLEAN NOT NULL DEFAULT false,
  "editorNote" TEXT,
  "editedByUserId" UUID,
  "editedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "NewsItem_pkey" PRIMARY KEY ("id")
);

-- Constraints and indexes
CREATE UNIQUE INDEX "NewsItem_url_key" ON "NewsItem"("url");
CREATE INDEX "NewsItem_sourceId_idx" ON "NewsItem"("sourceId");
CREATE INDEX "NewsItem_status_idx" ON "NewsItem"("status");
CREATE INDEX "NewsItem_publishedAt_idx" ON "NewsItem"("publishedAt");
CREATE INDEX "NewsItem_isHidden_idx" ON "NewsItem"("isHidden");
CREATE INDEX "NewsItem_isFeatured_idx" ON "NewsItem"("isFeatured");

ALTER TABLE "NewsItem" ADD CONSTRAINT "NewsItem_sourceId_fkey"
  FOREIGN KEY ("sourceId") REFERENCES "NewsSource"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "NewsItem" ADD CONSTRAINT "NewsItem_editedByUserId_fkey"
  FOREIGN KEY ("editedByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
