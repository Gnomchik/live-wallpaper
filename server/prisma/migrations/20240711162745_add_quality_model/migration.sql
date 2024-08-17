/*
  Warnings:

  - You are about to drop the column `quality` on the `Video` table. All the data in the column will be lost.
  - Added the required column `qualityId` to the `Video` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "Quality" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Video" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "categoryId" INTEGER,
    "path" TEXT NOT NULL,
    "qualityId" INTEGER NOT NULL,
    "authorId" INTEGER,
    CONSTRAINT "Video_qualityId_fkey" FOREIGN KEY ("qualityId") REFERENCES "Quality" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Video_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Video_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Video" ("authorId", "categoryId", "id", "path", "title") SELECT "authorId", "categoryId", "id", "path", "title" FROM "Video";
DROP TABLE "Video";
ALTER TABLE "new_Video" RENAME TO "Video";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
