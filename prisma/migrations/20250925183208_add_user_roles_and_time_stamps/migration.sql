-- AlterTable
ALTER TABLE "public"."books" ALTER COLUMN "quantity" SET DEFAULT 1;

-- AlterTable
ALTER TABLE "public"."borrowing_process" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "public"."users" ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'USER',
ALTER COLUMN "updated_at" DROP DEFAULT;
