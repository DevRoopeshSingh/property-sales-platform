import { prisma } from "@/lib/prisma";

export type LocationTree = {
  id: string;
  name: string;
  cities: {
    id: string;
    name: string;
    localities: {
      id: string;
      name: string;
    }[];
  }[];
}[];

export async function getLocationTree(): Promise<LocationTree> {
  const states = await prisma.state.findMany({
    include: {
      cities: {
        include: {
          localities: true,
        },
      },
    },
    orderBy: { name: "asc" },
  });

  return states.map((state) => ({
    id: state.id,
    name: state.name,
    cities: state.cities.map((city) => ({
      id: city.id,
      name: city.name,
      localities: city.localities.map((loc) => ({
        id: loc.id,
        name: loc.name,
      })).sort((a, b) => a.name.localeCompare(b.name)),
    })).sort((a, b) => a.name.localeCompare(b.name)),
  }));
}
