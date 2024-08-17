-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Video" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "categoryId" INTEGER,
    "path" TEXT NOT NULL,
    "qualityId" INTEGER,
    "authorId" INTEGER,
    CONSTRAINT "Video_qualityId_fkey" FOREIGN KEY ("qualityId") REFERENCES "Quality" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Video_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Video_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Video" ("authorId", "categoryId", "id", "path", "qualityId", "title") SELECT "authorId", "categoryId", "id", "path", "qualityId", "title" FROM "Video";
DROP TABLE "Video";
ALTER TABLE "new_Video" RENAME TO "Video";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
