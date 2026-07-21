"use server";

import { prisma } from "@/lib/prisma";
import { leadFormSchema, type LeadFormValues } from "@/lib/validations/lead";
import { revalidatePath } from "next/cache";
import { requireRole, ROLE_GROUPS } from "@/lib/permissions";

export async function updateLeadStatus(leadId: string, status: string) {
  try {
    await requireRole(ROLE_GROUPS.LEAD_MANAGERS);

  const validStatuses = ["NEW", "CONTACTED", "SITE_VISIT_SCHEDULED", "CONVERTED", "LOST"];
  if (!validStatuses.includes(status)) return { success: false, error: "Invalid status" };
    
    await prisma.lead.update({
      where: { id: leadId },
      data: { status: status as "NEW" | "CONTACTED" | "SITE_VISIT_SCHEDULED" | "CONVERTED" | "LOST" },
    });
    revalidatePath("/admin/leads");
    revalidatePath("/admin/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Error updating lead status:", error);
    return { success: false, error: "Failed to update status" };
  }
}

export async function submitLeadAction(data: LeadFormValues) {
  try {
    // Validate the data on the server
    const validData = leadFormSchema.parse(data);

    // Format the message if propertyType or budget are provided
    let combinedMessage = validData.message || "";
    if (validData.propertyType || validData.budget) {
      const details = [];
      if (validData.propertyType) details.push(`Interest: ${validData.propertyType}`);
      if (validData.budget) details.push(`Budget: ${validData.budget}`);
      
      const detailsString = details.join(" | ");
      combinedMessage = combinedMessage 
        ? `${detailsString}\n\nMessage: ${combinedMessage}`
        : detailsString;
    }

    // Create the lead in the database
    const lead = await prisma.lead.create({
      data: {
        name: validData.name,
        phone: validData.phone,
        email: validData.email || null,
        message: combinedMessage || null,
        source: "FORM",
        status: "NEW",
      },
    });

    return { success: true, leadId: lead.id };
  } catch (error) {
    console.error("Error submitting lead:", error);
    return { success: false, error: "Failed to submit inquiry. Please try again or contact us via WhatsApp." };
  }
}

export async function createManualLead(data: { name: string; phone: string; email?: string; message?: string; source: "WHATSAPP" | "CALL" | "FORM" }) {
  try {
    await requireRole(ROLE_GROUPS.LEAD_MANAGERS);
    
    if (!data.name || !data.phone || !data.source) {
      return { success: false, error: "Name, phone, and source are required" };
    }

    const lead = await prisma.lead.create({
      data: {
        name: data.name,
        phone: data.phone,
        email: data.email || null,
        message: data.message || null,
        source: data.source,
        status: "NEW",
      },
    });
    
    revalidatePath("/admin/leads");
    revalidatePath("/admin/dashboard");
    return { success: true, leadId: lead.id };
  } catch (error) {
    console.error("Error creating manual lead:", error);
    return { success: false, error: "Failed to create lead" };
  }
}
