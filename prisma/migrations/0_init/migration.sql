-- CreateTable
CREATE TABLE "Experiments" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "Experiment_Name" TEXT,
    "Device_Type" TEXT,
    "Repo_id" INTEGER,
    "experiment_path" TEXT,
    "experiment_uuid" TEXT,
    CONSTRAINT "Experiments_Repo_id_fkey" FOREIGN KEY ("Repo_id") REFERENCES "Repos" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "Variants" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "filePath" TEXT NOT NULL,
    "weights" DECIMAL NOT NULL,
    "Experiment_Id" INTEGER NOT NULL,
    CONSTRAINT "Variants_Experiment_Id_fkey" FOREIGN KEY ("Experiment_Id") REFERENCES "Experiments" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "Repos" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "FilePath" TEXT NOT NULL
);

