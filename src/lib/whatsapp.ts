interface WhatsAppLinkParams {
  phone?: string;
  propertyTitle?: string;
  propertyId?: string;
  source?: string;
  settings?: Record<string, string>; // Add settings object
  
  // New fields for rich message context
  builderName?: string | null;
  locality?: string | null;
  bhk?: number | null;
  area?: number | null;
  priceLabel?: string | null;
  url?: string;
}

/**
 * Generates a WhatsApp deep link with a pre-filled message
 * tracking the source page via UTM-style approach
 */
export function generateWhatsAppLink({
  phone,
  propertyTitle,
  propertyId,
  settings,
  builderName,
  locality,
  bhk,
  area,
  priceLabel,
  url,
}: WhatsAppLinkParams = {}): string {
  const whatsappNumber =
    phone ?? settings?.waNumber ?? process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "";

  let message: string;

  if (propertyTitle && propertyId) {
    const shortId = propertyId.slice(-6).toUpperCase();
    
    // Build a rich message if we have extra data
    if (priceLabel || locality) {
      const projectLine = builderName ? `${propertyTitle} by ${builderName}` : propertyTitle;
      const locationLine = locality ? `\n📍 *Location:* ${locality}` : "";
      
      const configParts = [];
      if (bhk) configParts.push(`${bhk} BHK`);
      if (area) configParts.push(`${area} sq.ft`);
      const configLine = configParts.length > 0 ? `\n🛏 *Configuration:* ${configParts.join(" • ")}` : "";
      
      const priceLine = priceLabel ? `\n💰 *Price:* ${priceLabel}` : "";
      const urlLine = url ? `\n\n🔗 Link: ${url}` : "";

      message = `Hello PropConnect team, 👋\n\nI am interested in this premium property:\n🏢 *Project:* ${projectLine}${locationLine}${configLine}${priceLine}\n\nPlease share the brochure and arrange a site visit.${urlLine}\n🔖 Ref ID: #${shortId}`;
    } else {
      // Fallback to basic message
      message = `Hi, I'm interested in "${propertyTitle}" (ID: #${shortId}). Please share more details.`;
    }
  } else {
    message = settings?.waDefaultMsg ?? "Hi, I'm looking for properties. Please help me.";
  }

  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
}

/**
 * Formats phone number for tel: links
 */
export function generateCallLink(phone?: string): string {
  const number = phone ?? process.env.NEXT_PUBLIC_CONTACT_PHONE ?? "";
  return `tel:${number.replace(/\s/g, "")}`;
}
