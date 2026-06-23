import { prisma } from "../src/lib/prisma";
import bcrypt from "bcryptjs";

async function main() {
  const email = "admin@propconnect.in";
  
  // Check if admin already exists
  const existingAdmin = await prisma.adminUser.findUnique({
    where: { email },
  });

  if (existingAdmin) {
    console.log("Admin user already exists. Skipping seed.");
    return;
  }

  // Create admin user
  const hashedPassword = await bcrypt.hash("password123", 10);
  
  await prisma.adminUser.create({
    data: {
      name: "Super Admin",
      email: email,
      password: hashedPassword,
    },
  });

  console.log("✅ Seeded admin user successfully!");
  console.log("Email: admin@propconnect.in");
  console.log("Password: password123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
