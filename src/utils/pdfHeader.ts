import { jsPDF } from "jspdf";
import { format } from "date-fns";

export interface CompanyInfo {
  name?: string | null;
  address?: string | null;
  phone?: string | null;
  email?: string | null;
  website?: string | null;
  logoUrl?: string | null;
}

/**
 * Loads an image from a URL and returns it as an HTMLImageElement.
 * This is meant to be used in a browser environment.
 */
const loadImage = (url: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(new Error("Failed to load image at " + url));
    img.src = url;
  });
};

/**
 * Draws a standardized header for ERP PDFs including Company Logo, Info, and Document Title.
 * @returns The new Y position after the header.
 */
export const drawHeader = async (
  doc: jsPDF,
  company: CompanyInfo | null | undefined,
  title?: string,
  docDate?: string | Date
): Promise<number> => {
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 14;
  let y = 15;
  const startY = y;

  // 1. Draw Date at the very top right (Professional Industry standard)
  if (docDate) {
    const dateStr = typeof docDate === "string" ? docDate : format(docDate, "dd MMM yyyy");
    doc.setFontSize(9);
    doc.setTextColor(120); // Subtle gray for metadata
    doc.setFont("helvetica", "normal");
    doc.text(`Date: ${dateStr}`, pageWidth - margin, y, { align: "right" });
    doc.setTextColor(0); // Reset for name
  }

  // 2. Draw Logo on the Top Left (Anchor the brand)
  let logoHeight = 0;
  if (company?.logoUrl) {
    try {
      const img = await loadImage(company.logoUrl);
      const imgWidth = 22; // Professional size (approx 2.2cm)
      logoHeight = (img.height * imgWidth) / img.width;
      doc.addImage(img, "PNG", margin, y, imgWidth, logoHeight);
    } catch (error) {
      console.warn("Could not add logo to PDF header:", error);
    }
  }

  // 3. Company Identity (Centered for strong focus)
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  const name = (company?.name || "Moon Textile").toUpperCase();
  
  // Vertical centering: if logo is present, we align name slightly below the top of logo
  const nameY = y + 5;
  doc.text(name, pageWidth / 2, nameY, { align: "center" });
  y = nameY + 6;

  // 4. Address and Contact Section (Centered below the name)
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(80); // Softer than black but very readable

  const address = company?.address || "";
  if (address) {
    const addrLines = doc.splitTextToSize(address, pageWidth - margin * 5); // Wide margin to avoid logo overlap
    doc.text(addrLines, pageWidth / 2, y, { align: "center" });
    y += (Array.isArray(addrLines) ? addrLines.length : 1) * 4;
  }

  const contactItems = [];
  if (company?.phone) contactItems.push(`Phone: ${company.phone}`);
  if (company?.email) contactItems.push(`Email: ${company.email}`);
  if (company?.website) contactItems.push(`Web: ${company.website}`);

  if (contactItems.length > 0) {
    const contactLine = contactItems.join("  •  "); // Professional dot separator
    doc.text(contactLine, pageWidth / 2, y, { align: "center" });
    y += 5;
  }

  // Ensure our divider line is safely below both the logo and the text block
  y = Math.max(y, startY + logoHeight + 4);

  // 5. High-End Divider
  doc.setLineWidth(0.4);
  doc.setDrawColor(210); // Subtle divider
  doc.line(margin, y, pageWidth - margin, y);
  y += 10;

  // 6. Document Title Block
  if (title) {
    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.setFont("helvetica", "bold");
    const upperTitle = title.toUpperCase();
    doc.text(upperTitle, pageWidth / 2, y, { align: "center" });
    
    // Clean underline for the section title
    const titleWidth = doc.getTextWidth(upperTitle);
    doc.setLineWidth(0.4);
    doc.setDrawColor(0);
    doc.line(pageWidth / 2 - titleWidth / 2, y + 1.5, pageWidth / 2 + titleWidth / 2, y + 1.5);
    y += 12;
  }

  return y;
};
