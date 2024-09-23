-- CreateTable
CREATE TABLE "Company" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "logo" TEXT,
    "companyName" TEXT NOT NULL,
    "activity" TEXT,
    "status" TEXT,
    "category" TEXT,
    "address" TEXT,
    "city" TEXT,
    "country" TEXT,
    "tel1" TEXT,
    "tel2" TEXT,
    "email" TEXT,
    "capital" REAL,
    "dateCreation" DATETIME,
    "numberSalarie" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
