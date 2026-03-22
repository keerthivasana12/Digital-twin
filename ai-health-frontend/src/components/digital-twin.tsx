import { useState } from "react";
import axios from "axios";
import Charts from "./charts";
import generatePDF from "./report-pdf";

const API_URL = "https://capstone-backend-1egj.onrender.com/analyze";

export default function DigitalTwin() {
  const [form, setForm] = useState({
    patient_id: "P001",
    age: "",
    bmi: "",
    bp: "",
    glucose: "",
    cholesterol: "",
    smoking: 0,
    physical_activity: 0,
  });

  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await axios.post(API_URL, {
        ...form,
        age: Number(form.age),
        bmi: Number(form.bmi),
        bp: Number(form.bp),
        glucose: Number(form.glucose),
        cholesterol: Number(form.cholesterol),
      });

      setResult(res.data);
    } catch (err) {
      console.error(err);
      alert("⚠️ API Error - Check backend");
    }
    setLoading(false);
  };

  // 🎨 Dynamic color based on risk
  const getRiskColor = (risk: string) => {
    if (risk === "High") return "text-red-600";
    if (risk === "Medium") return "text-yellow-600";
    return "text-green-600";
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">

      {/* HEADER */}
      <h1 className="text-4xl font-bold text-center text-blue-700">
        🏥 Digital Patient Twin Dashboard
      </h1>

      {/* FORM */}
      <div className="grid grid-cols-2 gap-4 bg-white p-6 rounded-xl shadow-lg">

        {["age", "bmi", "bp", "glucose", "cholesterol"].map((field) => (
          <input
            key={field}
            name={field}
            placeholder={field.toUpperCase()}
            onChange={handleChange}
            className="border p-3 rounded-lg focus:ring-2 focus:ring-blue-400"
          />
        ))}

        <button
          onClick={handleSubmit}
          className="col-span-2 bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition"
        >
          {loading ? "⏳ Analyzing..." : "Analyze Patient"}
        </button>
      </div>

      {/* RESULTS */}
      {result && (
        <div className="grid md:grid-cols-2 gap-6">

          {/* Risk */}
          <div className="card">
            <h2 className="title">Risk Level</h2>
            <p className={`text-2xl font-bold ${getRiskColor(result.risk)}`}>
              {result.risk}
            </p>
          </div>

          {/* Score */}
          <div className="card">
            <h2 className="title">Health Score</h2>
            <p className="text-xl">{result.health_score}</p>
          </div>

          {/* Chart */}
          <div className="md:col-span-2">
            <Charts data={result} />
          </div>

          {/* Recommendations */}
          <div className="card">
            <h2 className="title">Recommendations</h2>
            <ul className="list-disc ml-4">
              {result.recommendations.map((r: string, i: number) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </div>

          {/* Explainability */}
          <div className="card">
            <h2 className="title">Explainability (AI Insights)</h2>
            <pre className="text-sm whitespace-pre-wrap">
              {result.explainability}
            </pre>
          </div>

          {/* AI REPORT */}
          <div className="card md:col-span-2">
            <h2 className="title">AI Clinical Report</h2>
            <p className="leading-relaxed whitespace-pre-line">
              {result.ai_report}
            </p>
          </div>

          {/* PDF */}
          <div className="md:col-span-2 text-center">
            <button
              onClick={() => generatePDF(result)}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
            >
              📄 Download PDF Report
            </button>
          </div>

        </div>
      )}
    </div>
  );
}