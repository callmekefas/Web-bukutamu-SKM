/*
  Warnings:

  - Added the required column `updatedAt` to the `GuestBook` table without a default value. This is not possible if the table is not empty.
  - Added the required column `displayOrder` to the `SurveyQuestion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `SurveyQuestion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `SurveyResponse` table without a default value. This is not possible if the table is not empty.
  - Made the column `guestBookId` on table `SurveyResponse` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_GuestBook" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "fullName" TEXT NOT NULL,
    "whatsapp" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "gender" TEXT NOT NULL,
    "education" TEXT NOT NULL,
    "occupation" TEXT NOT NULL,
    "service" TEXT NOT NULL,
    "customService" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_GuestBook" ("age", "createdAt", "customService", "education", "fullName", "gender", "id", "occupation", "service", "whatsapp") SELECT "age", "createdAt", "customService", "education", "fullName", "gender", "id", "occupation", "service", "whatsapp" FROM "GuestBook";
DROP TABLE "GuestBook";
ALTER TABLE "new_GuestBook" RENAME TO "GuestBook";
CREATE INDEX "GuestBook_createdAt_idx" ON "GuestBook"("createdAt");
CREATE INDEX "GuestBook_service_idx" ON "GuestBook"("service");
CREATE TABLE "new_SurveyAnswer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "responseId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "SurveyAnswer_responseId_fkey" FOREIGN KEY ("responseId") REFERENCES "SurveyResponse" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "SurveyAnswer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "SurveyQuestion" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_SurveyAnswer" ("id", "questionId", "responseId", "score") SELECT "id", "questionId", "responseId", "score" FROM "SurveyAnswer";
DROP TABLE "SurveyAnswer";
ALTER TABLE "new_SurveyAnswer" RENAME TO "SurveyAnswer";
CREATE INDEX "SurveyAnswer_responseId_idx" ON "SurveyAnswer"("responseId");
CREATE INDEX "SurveyAnswer_questionId_idx" ON "SurveyAnswer"("questionId");
CREATE UNIQUE INDEX "SurveyAnswer_responseId_questionId_key" ON "SurveyAnswer"("responseId", "questionId");
CREATE TABLE "new_SurveyQuestion" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "unsurCode" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "displayOrder" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_SurveyQuestion" ("createdAt", "id", "isActive", "question", "unsurCode") SELECT "createdAt", "id", "isActive", "question", "unsurCode" FROM "SurveyQuestion";
DROP TABLE "SurveyQuestion";
ALTER TABLE "new_SurveyQuestion" RENAME TO "SurveyQuestion";
CREATE UNIQUE INDEX "SurveyQuestion_unsurCode_key" ON "SurveyQuestion"("unsurCode");
CREATE INDEX "SurveyQuestion_displayOrder_idx" ON "SurveyQuestion"("displayOrder");
CREATE INDEX "SurveyQuestion_isActive_idx" ON "SurveyQuestion"("isActive");
CREATE TABLE "new_SurveyResponse" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "guestBookId" TEXT NOT NULL,
    "feedback" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "SurveyResponse_guestBookId_fkey" FOREIGN KEY ("guestBookId") REFERENCES "GuestBook" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_SurveyResponse" ("createdAt", "feedback", "guestBookId", "id") SELECT "createdAt", "feedback", "guestBookId", "id" FROM "SurveyResponse";
DROP TABLE "SurveyResponse";
ALTER TABLE "new_SurveyResponse" RENAME TO "SurveyResponse";
CREATE UNIQUE INDEX "SurveyResponse_guestBookId_key" ON "SurveyResponse"("guestBookId");
CREATE INDEX "SurveyResponse_createdAt_idx" ON "SurveyResponse"("createdAt");
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'ADMIN',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_User" ("createdAt", "id", "name", "password", "role", "username") SELECT "createdAt", "id", "name", "password", "role", "username" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
