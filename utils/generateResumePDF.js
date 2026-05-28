import { jsPDF } from "jspdf";

export const generateResumePDF = (parsedData) => {
  if (!parsedData) return;

  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const contentWidth = pageWidth - 2 * margin;
  let y = margin;

  // Helpers
  const addText = (text, size, isBold = false, align = "left", color = "#000000") => {
    if (!text) return;
    doc.setFont("helvetica", isBold ? "bold" : "normal");
    doc.setFontSize(size);
    doc.setTextColor(color);
    
    const lines = doc.splitTextToSize(text, contentWidth);
    const textHeight = lines.length * size * 0.3527; // mm per pt approx

    // Check page break
    if (y + textHeight > doc.internal.pageSize.getHeight() - margin) {
      doc.addPage();
      y = margin;
    }

    if (align === "center") {
      doc.text(lines, pageWidth / 2, y, { align: "center" });
    } else {
      doc.text(lines, margin, y);
    }
    
    y += textHeight + 2; // Add spacing
  };

  const addHeader = (text) => {
    if (!text) return;
    y += 4;
    addText(text.toUpperCase(), 12, true, "left", "#333333");
    
    // Draw a line under header
    doc.setDrawColor(200, 200, 200);
    doc.line(margin, y - 2, pageWidth - margin, y - 2);
    y += 2;
  };

  // --- Start Document ---

  // Name & Title
  addText(parsedData.fullName || "Resume", 24, true, "center");
  addText(parsedData.targetRole || "", 12, false, "center", "#666666");
  y += 6;

  // Education Section
  if (parsedData.degree || parsedData.college) {
    addHeader("Education");
    
    let eduText = "";
    if (parsedData.degree) eduText += `${parsedData.degree}`;
    if (parsedData.branch) eduText += ` in ${parsedData.branch}`;
    
    addText(eduText, 11, true);
    addText(parsedData.college || "", 10, false, "left", "#444444");
    if (parsedData.cgpa) {
      addText(`CGPA: ${parsedData.cgpa}`, 10, false, "left", "#666666");
    }
    y += 4;
  }

  // Skills Section
  if (parsedData.skills && parsedData.skills.length > 0) {
    addHeader("Skills");
    const skillsText = parsedData.skills.join(" • ");
    addText(skillsText, 10, false);
    y += 4;
  }

  // Experience Section
  if (parsedData.experience) {
    addHeader("Experience");
    addText(parsedData.experience, 10, false);
    y += 4;
  }

  // Interests Section
  if (parsedData.interests && parsedData.interests.length > 0) {
    addHeader("Interests");
    const interestsText = parsedData.interests.join(" • ");
    addText(interestsText, 10, false);
    y += 4;
  }

  // Footer for ATS
  y = doc.internal.pageSize.getHeight() - margin + 10;
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text("Generated via Uplyft-AI - ATS Optimized Format", pageWidth / 2, y, { align: "center" });

  // Download the PDF
  const filename = parsedData.fullName 
    ? `${parsedData.fullName.replace(/\s+/g, '_')}_Resume.pdf` 
    : "ATS_Optimized_Resume.pdf";
  
  doc.save(filename);
};
