-- CreateTable
CREATE TABLE "Board" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "viewport" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Board_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "boardId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "cursor" JSONB,
    "color" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "lastSeen" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Board_updatedAt_idx" ON "Board"("updatedAt");

-- CreateIndex
CREATE INDEX "Session_boardId_idx" ON "Session"("boardId");

-- CreateIndex
CREATE INDEX "Session_lastSeen_idx" ON "Session"("lastSeen");
