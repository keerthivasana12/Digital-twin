import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  Cell, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  CartesianGrid
} from "recharts";

export default function Charts({ data }: any) {
  // 1. Map color to Risk Level consistently with the main Dashboard
  const getRiskColor = (risk: string) => {
    if (risk === "High") return "#ef4444"; // red-500
    if (risk === "Medium") return "#f59e0b"; // amber-500
    return "#10b981"; // emerald-500
  };

  const summaryData = [
    { name: "Health Score", value: data.health_score, color: "#2563eb" },
    { 
      name: "Risk Index", 
      value: data.risk === "High" ? 90 : data.risk === "Medium" ? 50 : 20,
      color: getRiskColor(data.risk) 
    }
  ];

  // 2. Normalized Radar Data (scaling everything to a 0-100 visual range)
  const radarData = [
    { subject: 'BMI', A: Math.min((data.bmi / 40) * 100, 100) },
    { subject: 'BP', A: Math.min((data.bp / 180) * 100, 100) },
    { subject: 'Glucose', A: Math.min((data.glucose / 200) * 100, 100) },
    { subject: 'Chol.', A: Math.min((data.cholesterol / 300) * 100, 100) },
    { subject: 'Activity', A: data.physical_activity ? 100 : 30 },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      {/* Simulation Metrics Bar Chart */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6">Simulation Metrics</h3>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={summaryData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#64748b', fontSize: 12, fontWeight: 700 }} 
              />
              <YAxis hide domain={[0, 100]} />
              <Tooltip 
                cursor={{ fill: '#f8fafc' }}
                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
              />
              <Bar dataKey="value" radius={[10, 10, 10, 10]} barSize={50}>
                {summaryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Biomarker Radar Chart */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6">Health Shape (Normalized)</h3>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
              <PolarGrid stroke="#e2e8f0" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 11, fontWeight: 700 }} />
              <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
              <Radar
                name="Patient Twin"
                dataKey="A"
                stroke={getRiskColor(data.risk)}
                strokeWidth={3}
                fill={getRiskColor(data.risk)}
                fillOpacity={0.15}
              />
              <Tooltip 
                 contentStyle={{ borderRadius: '12px', border: 'none', fontSize: '12px' }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}