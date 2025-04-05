/*
  Warnings:

  - You are about to drop the column `subTitle` on the `blog_posts` table. All the data in the column will be lost.
  - Added the required column `subtitle` to the `blog_posts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `blog_posts` DROP COLUMN `subTitle`,
    ADD COLUMN `subtitle` VARCHAR(100) NOT NULL;
