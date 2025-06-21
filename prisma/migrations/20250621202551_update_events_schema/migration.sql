/*
  Warnings:

  - You are about to drop the column `category` on the `events` table. All the data in the column will be lost.
  - You are about to drop the column `currentAttendees` on the `events` table. All the data in the column will be lost.
  - You are about to drop the column `date` on the `events` table. All the data in the column will be lost.
  - You are about to drop the column `maxAttendees` on the `events` table. All the data in the column will be lost.
  - You are about to drop the column `time` on the `events` table. All the data in the column will be lost.
  - Added the required column `link` to the `events` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startDate` to the `events` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "events" DROP COLUMN "category",
DROP COLUMN "currentAttendees",
DROP COLUMN "date",
DROP COLUMN "maxAttendees",
DROP COLUMN "time",
ADD COLUMN     "endDate" TIMESTAMP(3),
ADD COLUMN     "link" TEXT NOT NULL,
ADD COLUMN     "startDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "ticketAvailability" BOOLEAN NOT NULL DEFAULT true;
