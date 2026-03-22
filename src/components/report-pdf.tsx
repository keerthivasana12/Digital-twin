import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function generatePDF(data: any) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // --- 1. HEADER & BRANDING ---
  doc.setFillColor(15, 23, 42); // Slate-900
  doc.rect(0, 0, pageWidth, 40, "F");
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("DIGITAL TWIN CLINICAL REPORT", 15, 20);
  
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Patient ID: ${data.patient_id || "P001"}`, 15, 30);
  doc.text(`Generated: ${new Date().toLocaleString()}`, pageWidth - 15, 30, { align: "right" });

  // --- 2. EXECUTIVE SUMMARY (Boxes) ---
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(14);
  doc.text("Executive Summary", 15, 55);

  const riskColor = data.risk === "High" ? [220, 38, 38] : data.risk === "Medium" ? [245, 158, 11] : [22, 163, 74];
  
  // Risk Box
  doc.setDrawColor(220, 220, 220);
  doc.roundedRect(15, 60, 85, 25, 3, 3, "S");
  doc.setFontSize(9);
  doc.text("RISK ASSESSMENT", 20, 68);
  doc.setTextColor(riskColor[0], riskColor[1], riskColor[2]);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text(data.risk.toUpperCase(), 20, 78);

  // Health Score Box
  doc.setTextColor(0, 0, 0);
  doc.roundedRect(110, 60, 85, 25, 3, 3, "S");
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text("OVERALL HEALTH SCORE", 115, 68);
  doc.setFontSize(16);
  doc.setTextColor(37, 99, 235);
  doc.text(`${data.health_score}/100`, 115, 78);

  // --- 3. PATIENT VITALS SNAPSHOT (New Table) ---
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Biometric Data Snapshot", 15, 100);

  autoTable(doc, {
    startY: 105,
    head: [['Metric', 'Value', 'Status']],
    body: [
      ['Age', `${data.age} Years`, '-'],
      ['Body Mass Index (BMI)', `${data.bmi} kg/m²`, data.bmi > 25 ? 'High' : 'Normal'],
      ['Blood Pressure (Systolic)', `${data.bp} mmHg`, data.bp > 130 ? 'Elevated' : 'Normal'],
      ['Glucose Levels', `${data.glucose} mg/dL`, data.glucose > 100 ? 'High' : 'Normal'],
      ['Cholesterol', `${data.cholesterol} mg/dL`, data.cholesterol > 200 ? 'High' : 'Normal'],
    ],
    theme: 'grid',
    styles: { fontSize: 9 },
    headStyles: { fillColor: [71, 85, 105] }, // Slate-600
  });

  // --- 4. CLINICAL RECOMMENDATIONS ---
  const currentY = (doc as any).lastAutoTable.finalY + 15;
  doc.setFontSize(14);
  doc.text("Actionable Recommendations", 15, currentY);

  autoTable(doc, {
    startY: currentY + 5,
    head: [['Priority', 'Clinical Recommendation']],
    body: data.recommendations.map((r: string, i: number) => [i + 1, r]),
    theme: 'striped',
    headStyles: { fillColor: [37, 99, 235] },
    styles: { fontSize: 9 }
  });

  // --- 5. AI CLINICAL NARRATIVE (With Page Wrap) ---
  let nextY = (doc as any).lastAutoTable.finalY + 15;
  
  // Check if we need a new page for the narrative
  if (nextY > pageHeight - 50) {
    doc.addPage();
    nextY = 20;
  }

  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text("AI Clinical Interpretation", 15, nextY);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(51, 65, 85);

  const splitText = doc.splitTextToSize(data.ai_report, pageWidth - 30);
  doc.text(splitText, 15, nextY + 10);

  // --- 6. FOOTER (Multi-page support) ---
  const totalPages = doc.internal.pages.length - 1;
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    
    // Line separator
    doc.setDrawColor(226, 232, 240);
    doc.line(15, pageHeight - 15, pageWidth - 15, pageHeight - 15);
    
    doc.text(
      "CONFIDENTIAL: This AI-generated report is for clinical simulation purposes. Consult a physician for medical advice.",
      15,
      pageHeight - 10
    );
    doc.text(`Page ${i} of ${totalPages}`, pageWidth - 15, pageHeight - 10, { align: "right" });
  }

  doc.save(`Clinical_Twin_Report_${data.patient_id || "P001"}.pdf`);
}