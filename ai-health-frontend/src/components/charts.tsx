import { BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";

export default function Charts({ data }: any) {

  const chartData = [
    { name: "Health Score", value: data.health_score },
    { name: "Risk Index", value: data.risk === "High" ? 80 : data.risk === "Medium" ? 50 : 20 }
  ];

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="font-bold mb-2">Health Analytics</h2>

      <BarChart width={300} height={200} data={chartData}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="value" />
      </BarChart>
    </div>
  );
}