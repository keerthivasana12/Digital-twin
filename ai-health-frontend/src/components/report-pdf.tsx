import jsPDF from "jspdf";

export default function generatePDF(data: any) {
  const doc = new jsPDF();

  doc.text("AI Health Report", 10, 10);

  doc.text(`Risk: ${data.risk}`, 10, 20);
  doc.text(`Health Score: ${data.health_score}`, 10, 30);

  doc.text("Recommendations:", 10, 40);
  data.recommendations.forEach((r: string, i: number) => {
    doc.text(`- ${r}`, 10, 50 + i * 10);
  });

  doc.text("AI Report:", 10, 80);
  doc.text(data.ai_report.substring(0, 500), 10, 90);

  doc.save("health-report.pdf");
}