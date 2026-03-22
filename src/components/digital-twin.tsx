import { useState } from "react";
import axios from "axios";
import { Activity, Heart, ShieldCheck, FileText, Download, User, Info, Flame, Dumbbell } from "lucide-react"; 
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
    physical_activity: 1, // Default to active
  });

  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
        smoking: Number(form.smoking),
        physical_activity: Number(form.physical_activity),
      });
      setResult(res.data);
    } catch (err) {
      console.error(err);
      alert("⚠️ API Error - Check connection");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-slate-900">
      {/* HEADER */}
      <header className="max-w-7xl mx-auto mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 flex items-center gap-2">
            <Activity className="text-blue-600 w-8 h-8" />
            Digital Patient Twin <span className="text-blue-600">v2.0</span>
          </h1>
          <p className="text-slate-500 mt-1">AI-Powered Clinical Simulation & Analysis</p>
        </div>
        <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-2xl shadow-sm border border-slate-200">
            <User className="text-blue-600 w-5 h-5" />
            <span className="font-bold text-sm text-slate-700">{form.patient_id}</span>
        </div>
      </header>

      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* SIDEBAR: INPUT FORM */}
        <div className="lg:col-span-4">
          <section className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200 overflow-hidden sticky top-8">
            <div className="bg-slate-900 p-5 flex items-center gap-3">
              <Heart className="w-5 h-5 text-red-400" />
              <h2 className="text-white font-bold tracking-wide">Patient Vitals</h2>
            </div>
            
            <div className="p-6 space-y-5">
              {/* Patient Age - Prominent Input */}
              <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100">
                <label className="block text-xs font-black text-blue-600 uppercase mb-2">Age (Years)</label>
                <input
                  name="age"
                  type="number"
                  value={form.age}
                  onChange={handleChange}
                  placeholder="e.g. 45"
                  className="w-full bg-white border-none text-2xl font-bold text-slate-800 placeholder:text-slate-300 focus:ring-0 rounded-lg p-1"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { id: "bmi", label: "BMI", icon: "kg/m²" },
                  { id: "bp", label: "Systolic BP", icon: "mmHg" },
                  { id: "glucose", label: "Glucose", icon: "mg/dL" },
                  { id: "cholesterol", label: "Cholesterol", icon: "mg/dL" },
                ].map((field) => (
                  <div key={field.id}>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 ml-1">{field.label}</label>
                    <div className="relative">
                        <input
                            name={field.id}
                            type="number"
                            onChange={handleChange}
                            className="w-full border border-slate-100 p-3 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none bg-slate-50"
                        />
                        <span className="absolute right-3 top-3 text-[10px] font-bold text-slate-300">{field.icon}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Behavioral Selection */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-sm font-bold text-slate-600 flex items-center gap-2"><Flame className="w-4 h-4 text-orange-500" /> Smoker?</span>
                    <select name="smoking" onChange={handleChange} className="bg-transparent font-bold text-blue-600 outline-none">
                        <option value={0}>No</option>
                        <option value={1}>Yes</option>
                    </select>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-sm font-bold text-slate-600 flex items-center gap-2"><Dumbbell className="w-4 h-4 text-emerald-500" /> Active?</span>
                    <select name="physical_activity" onChange={handleChange} className="bg-transparent font-bold text-blue-600 outline-none">
                        <option value={1}>Regularly</option>
                        <option value={0}>Sedentary</option>
                    </select>
                </div>
              </div>
              
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full py-4 rounded-2xl font-black text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all transform hover:-translate-y-1 active:scale-95 flex justify-center items-center gap-3 mt-4"
              >
                {loading ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" /> : "RUN SIMULATION"}
              </button>
            </div>
          </section>
        </div>

        {/* RESULTS AREA (Remains same logic as previous, with the new stylings) */}
        <div className="lg:col-span-8">
           {/* ... (Keep result rendering logic from the previous response) ... */}
           {result ? (
               <div className="space-y-6">
                 {/* Summary Cards, Charts, Recommendations, and AI Report as styled previously */}
                 {/* (Inserting the Health Ring and Risk Card here) */}
                 <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 flex items-center justify-between">
                        <div>
                            <h3 className="text-slate-400 text-xs font-black uppercase">Calculated Risk</h3>
                            <p className={`text-4xl font-black mt-2 ${result.risk === 'High' ? 'text-red-500' : 'text-emerald-500'}`}>{result.risk}</p>
                        </div>
                        <ShieldCheck className={`w-12 h-12 ${result.risk === 'High' ? 'text-red-500' : 'text-emerald-500'} opacity-20`} />
                    </div>
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 flex items-center justify-between">
                        <div>
                            <h3 className="text-slate-400 text-xs font-black uppercase">Health Score</h3>
                            <p className="text-4xl font-black mt-2 text-slate-900">{result.health_score}<span className="text-lg text-slate-300">/100</span></p>
                        </div>
                        <Activity className="w-12 h-12 text-blue-500 opacity-20" />
                    </div>
                 </div>
                 
                 <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                    <Charts data={result} />
                 </div>

                 <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-2xl">
                    <h3 className="flex items-center gap-2 font-bold mb-4 text-blue-400"><FileText className="w-5 h-5" /> Clinical AI Analysis</h3>
                    <p className="text-slate-400 leading-relaxed text-sm font-medium">{result.ai_report}</p>
                    <button onClick={() => generatePDF(result)} className="mt-6 flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl transition font-bold text-xs">
                        <Download className="w-4 h-4" /> DOWNLOAD CLINICAL PDF
                    </button>
                 </div>
               </div>
           ) : (
               <div className="h-full min-h-[500px] rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400">
                  <Activity className="w-16 h-16 mb-4 opacity-10" />
                  <p className="font-bold text-lg">System Ready</p>
                  <p className="text-sm">Complete the form to generate the Digital Twin.</p>
               </div>
           )}
        </div>
      </main>
    </div>
  );
}