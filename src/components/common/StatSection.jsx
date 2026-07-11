import { useState } from "react";
import { LayoutGrid, BarChart3 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

const StatSection = ({ title, data }) => {
  const [viewMode, setViewMode] = useState("cards");

  // Define a consistent color palette for cards
  const cardStyles = [
    "bg-blue-50 border-blue-100",
    "bg-emerald-50 border-emerald-100",
    "bg-violet-50 border-violet-100",
    "bg-amber-50 border-amber-100",
  ];

  return (
    <div className="space-y-6 mt-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-gray-800">{title}</h3>
        {data.length > 1 && (
          <div className="bg-white p-1 rounded-lg border shadow-sm flex gap-1">
            <button 
              onClick={() => setViewMode("cards")}
              className={`p-2 rounded-md transition-all ${viewMode === "cards" ? "bg-indigo-50 text-indigo-600" : "text-gray-400"}`}
            >
              <LayoutGrid size={18} />
            </button>
            <button 
              onClick={() => setViewMode("charts")}
              className={`p-2 rounded-md transition-all ${viewMode === "charts" ? "bg-indigo-50 text-indigo-600" : "text-gray-400"}`}
            >
              <BarChart3 size={18} />
            </button>
          </div>
        )}
      </div>

      {/* Cards or Charts */}
      {viewMode === "cards" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {data.map((item, i) => {
            const style = cardStyles[i % cardStyles.length];
            return (
              <div key={i} className={`${style} border-2 rounded-3xl p-6 transition-transform hover:scale-[1.02]`}>
                <p className="text-gray-600 text-sm font-semibold uppercase tracking-wider">{item.name}</p>
                <h2 className="text-4xl font-black mt-3" style={{ color: item.color }}>
                  {item.count}
                </h2>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip cursor={{fill: 'transparent'}} contentStyle={{borderRadius: '12px'}} />
              <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default StatSection;