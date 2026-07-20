import { NextResponse } from "next/server";
import * as XLSX from "xlsx";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    // Fetch all properties
    const properties = await prisma.property.findMany({
      orderBy: { createdAt: "desc" },
    });

    // Map properties to match the exact columns expected by the import process
    const exportData = properties.map((property) => ({
      Title: property.title,
      Description: property.description,
      Type: property.type,
      SubType: property.subType,
      Status: property.status,
      Price: Number(property.price), // BigInt needs to be converted to Number for Excel
      PriceLabel: property.priceLabel,
      PriceNegotiable: property.priceNegotiable ? "TRUE" : "FALSE",
      BHK: property.bhk || "",
      Area: property.area || "",
      CarpetArea: property.carpetArea || "",
      Floor: property.floor || "",
      TotalFloors: property.totalFloors || "",
      Locality: property.locality,
      Address: property.address,
      Possession: property.possession,
      // We don't have these fields strictly in export template sample yet, but let's include if possible
      Amenities: property.amenities.join(", ")
    }));

    // Create a new workbook
    const wb = XLSX.utils.book_new();

    // Convert JSON to Worksheet
    const ws = XLSX.utils.json_to_sheet(exportData);

    // Auto-size columns slightly
    const wscols = [
      { wch: 40 }, // Title
      { wch: 60 }, // Description
      { wch: 15 }, // Type
      { wch: 20 }, // SubType
      { wch: 10 }, // Status
      { wch: 15 }, // Price
      { wch: 10 }, // PriceLabel
      { wch: 15 }, // PriceNegotiable
      { wch: 5 },  // BHK
      { wch: 10 }, // Area
      { wch: 15 }, // CarpetArea
      { wch: 5 },  // Floor
      { wch: 15 }, // TotalFloors
      { wch: 20 }, // Locality
      { wch: 50 }, // Address
      { wch: 25 }, // Possession
      { wch: 60 }  // Amenities
    ];
    ws["!cols"] = wscols;

    // Append worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, "Properties");

    // Write workbook to a buffer
    const buf = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });

    return new NextResponse(buf, {
      headers: {
        "Content-Disposition": 'attachment; filename="properties_export.xlsx"',
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      },
    });
  } catch (error) {
    console.error("Failed to export properties:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
