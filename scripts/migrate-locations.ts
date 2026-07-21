import { PrismaClient, Locality } from "@prisma/client";

const prisma = new PrismaClient();

const LOCALITY_LABELS: Record<Locality, string> = {
  SEAWOODS: "Seawoods",
  KHARGHAR: "Kharghar",
  TALOJA: "Taloja",
  NERUL: "Nerul",
  VASHI: "Vashi",
  CBD_BELAPUR: "CBD Belapur",
  AIROLI: "Airoli",
  GHANSOLI: "Ghansoli",
  ULWE: "Ulwe",
  KAMOTHE: "Kamothe",
  SANPADA: "Sanpada",
  KALAMBOLI: "Kalamboli",
  PANVEL: "Panvel",
  MAHAPE: "Mahape",
};

const LOCALITY_SLUGS: Record<Locality, string> = {
  SEAWOODS: "seawoods",
  KHARGHAR: "kharghar",
  TALOJA: "taloja",
  NERUL: "nerul",
  VASHI: "vashi",
  CBD_BELAPUR: "cbd-belapur",
  AIROLI: "airoli",
  GHANSOLI: "ghansoli",
  ULWE: "ulwe",
  KAMOTHE: "kamothe",
  SANPADA: "sanpada",
  KALAMBOLI: "kalamboli",
  PANVEL: "panvel",
  MAHAPE: "mahape",
};

async function main() {
  console.log("Starting location migration...");

  // 1. Create State
  const state = await prisma.state.upsert({
    where: { slug: "maharashtra" },
    update: {},
    create: {
      name: "Maharashtra",
      slug: "maharashtra",
    },
  });
  console.log(`State created/found: ${state.name}`);

  // 2. Create City
  const city = await prisma.city.upsert({
    where: { slug_stateId: { slug: "navi-mumbai", stateId: state.id } },
    update: {},
    create: {
      name: "Navi Mumbai",
      slug: "navi-mumbai",
      stateId: state.id,
    },
  });
  console.log(`City created/found: ${city.name}`);

  // 3. Create LocationNodes
  const localities = Object.entries(LOCALITY_LABELS) as [Locality, string][];
  const locationMap = new Map<Locality, string>(); // Locality enum to LocationNode id

  for (const [enumVal, name] of localities) {
    const slug = LOCALITY_SLUGS[enumVal];
    const locationNode = await prisma.locationNode.upsert({
      where: { slug_cityId: { slug, cityId: city.id } },
      update: {},
      create: {
        name,
        slug,
        cityId: city.id,
      },
    });
    locationMap.set(enumVal, locationNode.id);
    console.log(`  - LocationNode created/found: ${locationNode.name}`);
  }

  // 4. Backfill Properties
  const properties = await prisma.property.findMany({
    where: {
      locationId: null, // Only backfill if not already done
      locality: { not: null }, // Only backfill if they have a legacy locality
    },
  });

  console.log(`Found ${properties.length} properties to backfill...`);

  let updatedCount = 0;
  for (const property of properties) {
    const enumVal = property.locality;
    if (!enumVal) continue;

    const locId = locationMap.get(enumVal);
    if (!locId) {
      console.warn(`    ⚠️ Unknown locality enum: ${enumVal} on property ${property.id}`);
      continue;
    }

    await prisma.property.update({
      where: { id: property.id },
      data: {
        stateId: state.id,
        cityId: city.id,
        locationId: locId,
      },
    });
    updatedCount++;
  }

  console.log(`Successfully backfilled ${updatedCount} properties.`);
  console.log("Migration complete.");
}

main()
  .catch((e) => {
    console.error("Error during migration:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
