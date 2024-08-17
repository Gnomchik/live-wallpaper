-- CreateTable
CREATE TABLE "User" (
    "id_user" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "login" TEXT NOT NULL,
    "password" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Task" (
    "id_task" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "id_user" INTEGER NOT NULL,
    CONSTRAINT "Task_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "User" ("id_user") ON DELETE RESTRICT ON UPDATE CASCADE
);
