/**
 * Run this script to create an admin user:
 *   npx dotenv-cli -e .env.local -- npx ts-node --skip-project scripts/seed-admin.ts
 *
 * Or if you have tsx installed:
 *   npx dotenv-cli -e .env.local -- npx tsx scripts/seed-admin.ts
 */

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@propconnect.in";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Admin@123456";
const ADMIN_NAME = process.env.ADMIN_NAME || "Admin";

async function main() {
  console.log("🔐 Seeding admin user...");

  const existing = await prisma.adminUser.findUnique({
    where: { email: ADMIN_EMAIL },
  });

  if (existing) {
    console.log(`✅ Admin user already exists: ${ADMIN_EMAIL}`);
    return;
  }

  const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 12);

  const admin = await prisma.adminUser.create({
    data: {
      email: ADMIN_EMAIL,
      name: ADMIN_NAME,
      password: hashedPassword,
    },
  });

  console.log(`✅ Admin user created successfully!`);
  console.log(`   Email: ${admin.email}`);
  console.log(`   Password: ${ADMIN_PASSWORD}`);
  console.log(`\n⚠️  IMPORTANT: Change your password after first login!`);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
