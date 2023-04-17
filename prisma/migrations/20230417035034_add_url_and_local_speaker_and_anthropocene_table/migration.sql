-- CreateTable
CREATE TABLE "urls" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "short_url" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "urls_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "local_speakers" (
    "id" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "batch" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "instagram" TEXT NOT NULL,
    "twibbon_link" TEXT NOT NULL,
    "google_drive_link" TEXT NOT NULL,
    "reason_to_join" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "local_speakers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "anthropocenes" (
    "id" TEXT NOT NULL,
    "src" TEXT,
    "article_src" TEXT DEFAULT '',
    "thumbnail" TEXT,
    "caption" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "anthropocenes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "urls_short_url_key" ON "urls"("short_url");
