/*
  Warnings:

  - You are about to drop the column `id_user` on the `Task` table. All the data in the column will be lost.
  - Added the required column `date` to the `Task` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `Task` table without a default value. This is not possible if the table is not empty.
  - Added the required column `priority` to the `Task` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tag` to the `Task` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Task" (
    "id_task" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "tag" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "priority" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "finished" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_Task" ("id_task", "title") SELECT "id_task", "title" FROM "Task";
DROP TABLE "Task";
ALTER TABLE "new_Task" RENAME TO "Task";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
