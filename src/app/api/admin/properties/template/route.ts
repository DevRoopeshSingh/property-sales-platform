import { NextResponse } from "next/server";
import * as XLSX from "xlsx";
import { auth } from "@/auth";

export async function GET() {
  const session = await auth();
  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  // Create a new workbook
  const wb = XLSX.utils.book_new();

  // Define headers and a sample row based on expected columns in PropertyImportModal
  const templateData = [
    {
      Title: "Luxury 3BHK Apartment in Seawoods",
      Description: "A beautiful sea-facing apartment with modern amenities and excellent connectivity. This is a sample description.",
      Type: "RESIDENTIAL",
      SubType: "APARTMENT",
      Status: "DRAFT",
      Price: 15000000,
      PriceLabel: "1.5 Cr",
      PriceNegotiable: true,
      BHK: 3,
      Area: 1500,
      CarpetArea: 1200,
      Floor: 12,
      TotalFloors: 25,
      Locality: "SEAWOODS",
      Address: "Palm Beach Road, Sector 40",
      Possession: "READY TO MOVE",
      Amenities: "Gym, Pool, Security, Power Backup"
    }
  ];

  // Convert JSON to Worksheet
  const ws = XLSX.utils.json_to_sheet(templateData);
  
  // Auto-size columns slightly
  const wscols = [
    { wch: 30 }, // Title
    { wch: 50 }, // Description
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
    { wch: 40 }, // Address
    { wch: 25 }, // Possession
    { wch: 50 }  // Amenities
  ];
  ws["!cols"] = wscols;

  // Append worksheet to workbook
  XLSX.utils.book_append_sheet(wb, ws, "Template");

  // Write workbook to a buffer
  const buf = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });

  return new NextResponse(buf, {
    headers: {
      "Content-Disposition": 'attachment; filename="properties_template.xlsx"',
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    },
  });
}
