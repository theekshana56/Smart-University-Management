import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function ResourceChart({ items }) {
  const data = [
    { name: "LAB", value: items.filter((r) => r.type === "LAB").length },
    { name: "LECTURE_HALL", value: items.filter((r) => r.type === "LECTURE_HALL").length },
    { name: "MEETING_ROOM", value: items.filter((r) => r.type === "MEETING_ROOM").length },
    { name: "EQUIPMENT", value: items.filter((r) => r.type === "EQUIPMENT").length },
  ];

  const colors = ["#2e8b57", "#1e88e5", "#f39c12", "#9b59b6"];

  return (
    <div className="card chartCard">
      <h3 className="chartTitle">Resource Types</h3>

      <div className="chartWrap">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="34%"
              cy="50%"
              outerRadius={100}
              label
            >
              {data.map((entry, index) => (
                <Cell key={index} fill={colors[index]} />
              ))}
            </Pie>

            <Tooltip />

            <Legend
              layout="vertical"
              verticalAlign="middle"
              align="right"
              iconType="circle"
              wrapperStyle={{
                right: 20,
                lineHeight: "24px",
                fontSize: "14px",
                fontWeight: 600,
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}