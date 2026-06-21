-- CreateTable
CREATE TABLE "Profile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "cmu_id" TEXT NOT NULL,
    "mode" TEXT NOT NULL,
    "date_reference" DATETIME NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "CalendarEvent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "date_prevue" DATETIME NOT NULL,
    "statut" TEXT NOT NULL DEFAULT 'a_venir',
    "profile_id" TEXT NOT NULL,
    CONSTRAINT "CalendarEvent_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "Profile" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Reminder" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "canal" TEXT NOT NULL DEFAULT 'app',
    "declenche" BOOLEAN NOT NULL DEFAULT false,
    "event_id" TEXT NOT NULL,
    CONSTRAINT "Reminder_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "CalendarEvent" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Profile_cmu_id_key" ON "Profile"("cmu_id");
