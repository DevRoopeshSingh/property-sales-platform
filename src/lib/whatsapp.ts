interface WhatsAppLinkParams {
  phone?: string;
  propertyTitle?: string;
  propertyId?: string;
  source?: string;
  settings?: Record<string, string>; // Add settings object
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
}: WhatsAppLinkParams = {}): string {
  const whatsappNumber =
    phone ?? settings?.waNumber ?? process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "";

  let message: string;

  if (propertyTitle && propertyId) {
    const shortId = propertyId.slice(-6).toUpperCase();
    message = `Hi, I'm interested in "${propertyTitle}" (ID: #${shortId}). Please share more details.`;
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
