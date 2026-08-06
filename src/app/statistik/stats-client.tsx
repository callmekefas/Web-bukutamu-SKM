"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

type ChartItem = {
  category: string;
  nilai: number;
};

export default function StatsClientChart({ data }: { data: ChartItem[] }) {
  const formattedData = data.map((item) => {
    const parts = item.category.split(" - ");
    return {
      ...item,
      shortLabel: parts[0], // U1, U2, dst agar pas di HP
      fullName: item.category,
    };
  });

  return (
    <div className="w-full h-[380px] sm:h-[400px] pt-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={formattedData} margin={{ top: 10, right: 10, left: -20, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis 
            dataKey="shortLabel" 
            interval={0}
            tick={{ fill: "#64748b", fontSize: 12, fontWeight: 700 }} 
          />
          <YAxis 
            domain={[0, 4]} 
            tick={{ fill: "#64748b", fontSize: 11 }} 
          />
          <Tooltip 
            formatter={(value) => [`${value} / 4.00`, "Nilai Rata-rata"]}
            labelFormatter={(label, payload) => {
              if (payload && payload.length > 0) {
                return payload[0].payload.fullName;
              }
              return label;
            }}
            contentStyle={{ backgroundColor: "#ffffff", borderRadius: "12px", border: "1px solid #e2e8f0", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
          />
          <Bar dataKey="nilai" fill="#2563eb" radius={[6, 6, 0, 0]}>
            {formattedData.map((_, index) => (
              <Cell key={`cell-${index}`} fill={index % 2 === 0 ? "#2563eb" : "#3b82f6"} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}