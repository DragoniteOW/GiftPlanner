-- CreateTable
CREATE TABLE "Person" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "birthday" TIMESTAMP(3),
    "notes" TEXT,
    "shareToken" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Person_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Occasion" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "isBuiltIn" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Occasion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PersonEvent" (
    "id" TEXT NOT NULL,
    "personId" TEXT NOT NULL,
    "occasionId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "notes" TEXT,

    CONSTRAINT "PersonEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GiftIdea" (
    "id" TEXT NOT NULL,
    "personId" TEXT NOT NULL,
    "occasionId" TEXT,
    "title" TEXT NOT NULL,
    "notes" TEXT,
    "todoNotes" TEXT,
    "imageUrl" TEXT,
    "status" TEXT NOT NULL DEFAULT 'IDEA',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GiftIdea_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GiftLink" (
    "id" TEXT NOT NULL,
    "giftIdeaId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "label" TEXT,

    CONSTRAINT "GiftLink_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GivenGift" (
    "id" TEXT NOT NULL,
    "personId" TEXT NOT NULL,
    "occasionId" TEXT,
    "sourceIdeaId" TEXT,
    "title" TEXT NOT NULL,
    "notes" TEXT,
    "imageUrl" TEXT,
    "givenDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GivenGift_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Person_shareToken_key" ON "Person"("shareToken");

-- CreateIndex
CREATE UNIQUE INDEX "Occasion_name_key" ON "Occasion"("name");

-- CreateIndex
CREATE UNIQUE INDEX "GivenGift_sourceIdeaId_key" ON "GivenGift"("sourceIdeaId");

-- AddForeignKey
ALTER TABLE "PersonEvent" ADD CONSTRAINT "PersonEvent_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PersonEvent" ADD CONSTRAINT "PersonEvent_occasionId_fkey" FOREIGN KEY ("occasionId") REFERENCES "Occasion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GiftIdea" ADD CONSTRAINT "GiftIdea_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GiftIdea" ADD CONSTRAINT "GiftIdea_occasionId_fkey" FOREIGN KEY ("occasionId") REFERENCES "Occasion"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GiftLink" ADD CONSTRAINT "GiftLink_giftIdeaId_fkey" FOREIGN KEY ("giftIdeaId") REFERENCES "GiftIdea"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GivenGift" ADD CONSTRAINT "GivenGift_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GivenGift" ADD CONSTRAINT "GivenGift_occasionId_fkey" FOREIGN KEY ("occasionId") REFERENCES "Occasion"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GivenGift" ADD CONSTRAINT "GivenGift_sourceIdeaId_fkey" FOREIGN KEY ("sourceIdeaId") REFERENCES "GiftIdea"("id") ON DELETE SET NULL ON UPDATE CASCADE;
