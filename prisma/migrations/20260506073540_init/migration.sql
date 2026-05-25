-- CreateTable
CREATE TABLE "Person" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "birthday" DATETIME,
    "notes" TEXT,
    "shareToken" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Occasion" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "isBuiltIn" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "PersonEvent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "personId" TEXT NOT NULL,
    "occasionId" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "notes" TEXT,
    CONSTRAINT "PersonEvent_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "PersonEvent_occasionId_fkey" FOREIGN KEY ("occasionId") REFERENCES "Occasion" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "GiftIdea" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "personId" TEXT NOT NULL,
    "occasionId" TEXT,
    "title" TEXT NOT NULL,
    "notes" TEXT,
    "todoNotes" TEXT,
    "imageUrl" TEXT,
    "status" TEXT NOT NULL DEFAULT 'IDEA',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "GiftIdea_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "GiftIdea_occasionId_fkey" FOREIGN KEY ("occasionId") REFERENCES "Occasion" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "GiftLink" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "giftIdeaId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "label" TEXT,
    CONSTRAINT "GiftLink_giftIdeaId_fkey" FOREIGN KEY ("giftIdeaId") REFERENCES "GiftIdea" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "GivenGift" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "personId" TEXT NOT NULL,
    "occasionId" TEXT,
    "sourceIdeaId" TEXT,
    "title" TEXT NOT NULL,
    "notes" TEXT,
    "imageUrl" TEXT,
    "givenDate" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "GivenGift_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "GivenGift_occasionId_fkey" FOREIGN KEY ("occasionId") REFERENCES "Occasion" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "GivenGift_sourceIdeaId_fkey" FOREIGN KEY ("sourceIdeaId") REFERENCES "GiftIdea" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Person_shareToken_key" ON "Person"("shareToken");

-- CreateIndex
CREATE UNIQUE INDEX "Occasion_name_key" ON "Occasion"("name");

-- CreateIndex
CREATE UNIQUE INDEX "GivenGift_sourceIdeaId_key" ON "GivenGift"("sourceIdeaId");
