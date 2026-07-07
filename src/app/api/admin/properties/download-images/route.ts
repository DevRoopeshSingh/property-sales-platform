import { NextRequest, NextResponse } from "next/server";
import JSZip from "jszip";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const images = body.images as { url: string; altText?: string }[];

    if (!images || images.length === 0) {
      return NextResponse.json({ error: "No images provided" }, { status: 400 });
    }

    const zip = new JSZip();

    // Fetch all images concurrently
    await Promise.all(
      images.map(async (img, index) => {
        try {
          const response = await fetch(img.url);
          if (!response.ok) return;

          const arrayBuffer = await response.arrayBuffer();
          // Generate a safe filename
          let ext = img.url.split(".").pop()?.split("?")[0] || "jpg";
          if (ext.length > 4) ext = "jpg"; // fallback if URL lacks extension
          
          const filename = img.altText 
            ? `${img.altText.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.${ext}`
            : `property-image-${index + 1}.${ext}`;

          // Add to zip archive
          zip.file(filename, arrayBuffer);
        } catch (err) {
          console.error(`Failed to fetch image ${img.url}`, err);
        }
      })
    );

    // Generate the ZIP as an ArrayBuffer (works in Edge/Web standard environments)
    const zipBuffer = await zip.generateAsync({ type: "arraybuffer" });

    // Return the file with proper Content-Type & Content-Disposition
    return new NextResponse(zipBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": 'attachment; filename="property-photos.zip"',
        "Content-Length": zipBuffer.byteLength.toString(),
      },
    });
  } catch (error) {
    console.error("ZIP Generation Error:", error);
    return NextResponse.json({ error: "Failed to generate ZIP file" }, { status: 500 });
  }
}
