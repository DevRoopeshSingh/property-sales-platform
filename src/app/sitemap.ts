import { MetadataRoute } from 'next'
import { prisma } from "@/lib/prisma"
import { SLUG_TO_LOCALITY } from "@/types"
 
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
  
  // Static Routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 1,
    },
    {
      url: `${baseUrl}/properties`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  // Locality Routes
  const localityRoutes: MetadataRoute.Sitemap = Object.keys(SLUG_TO_LOCALITY).map((slug) => ({
    url: `${baseUrl}/localities/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  // Property Routes
  const properties = await prisma.property.findMany({
    where: { status: 'ACTIVE' },
    select: { slug: true, updatedAt: true },
  });

  const propertyRoutes: MetadataRoute.Sitemap = properties.map((property) => ({
    url: `${baseUrl}/properties/${property.slug}`,
    lastModified: property.updatedAt,
    changeFrequency: 'weekly',
    priority: 0.6,
  }));

  return [...staticRoutes, ...localityRoutes, ...propertyRoutes];
}
