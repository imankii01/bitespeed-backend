-- DropForeignKey
ALTER TABLE "Contact" DROP CONSTRAINT "Contact_linkedId_fkey";

-- AlterTable
ALTER TABLE "Contact" ALTER COLUMN "linkPrecedence" SET DEFAULT 'primary';
