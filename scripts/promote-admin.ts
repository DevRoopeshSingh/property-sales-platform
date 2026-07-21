import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Promoting all existing admin users to SUPER_ADMIN...');
  const result = await prisma.adminUser.updateMany({
    data: {
      role: 'SUPER_ADMIN',
    },
  });
  console.log(`Successfully promoted ${result.count} user(s) to SUPER_ADMIN.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
