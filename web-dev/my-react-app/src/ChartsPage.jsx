// Page for Charts
import { useEffect, useState } from "react";
import Papa from "papaparse";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

function ChartsPage() {
  const [rawData, setRawData] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [view, setView] = useState("top");

  useEffect(() => {
    fetch("/data/games.csv")
      .then((res) => res.text())
      .then((csvText) => {
        const parsed = Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
        });
        setRawData(parsed.data);
      })
      .catch((err) => console.error("Error loading CSV:", err));
  }, []);

  useEffect(() => {
    if (!rawData.length) return;

    if (view === "top") {
      const cleaned = rawData
        .map((r) => ({
          title: r.title,
          total_sales: parseFloat(r.total_sales),
          critic_score: parseFloat(r.critic_score),
        }))
        .filter(
          (r) =>
            r.title &&
            !isNaN(r.total_sales) &&
            !isNaN(r.critic_score) &&
            r.total_sales > 0
        )
        .sort((a, b) => b.total_sales - a.total_sales)
        .slice(0, 20);
      setChartData(cleaned);
    }

    if (view === "genre") {
      const grouped = {};
      rawData.forEach((r) => {
        const genre = r.genre?.trim() || "Unknown";
        const sales = parseFloat(r.total_sales) || 0;
        grouped[genre] = (grouped[genre] || 0) + sales;
      });

      const arr = Object.entries(grouped)
        .map(([genre, total_sales]) => ({
          category: genre,
          total_sales: Math.round(total_sales),
        }))
        .sort((a, b) => b.total_sales - a.total_sales);

      setChartData(arr);
    }

    if (view === "console") {
      const grouped = {};
      rawData.forEach((r) => {
        const console = r.console?.trim() || "Unknown";
        const sales = parseFloat(r.total_sales) || 0;
        grouped[console] = (grouped[console] || 0) + sales;
      });

      const arr = Object.entries(grouped)
        .map(([console, total_sales]) => ({
          category: console,
          total_sales,
        }))
        .sort((a, b) => a.total_sales - b.total_sales);

      setChartData(arr);
    }
  }, [rawData, view]);

  return (
    <div className="page-wrapper">
      <div className="chart-container">
        <div className="chart-header">
          <h1>Game Sales Charts</h1>
          <h2>Game Sales Dashboard</h2>
        </div>

        <div className="chart-buttons">
          <button
            className={view === "top" ? "active" : ""}
            onClick={() => setView("top")}
          >
            🏆 Top Games
          </button>
          <button
            className={view === "genre" ? "active" : ""}
            onClick={() => setView("genre")}
          >
            🎭 By Genre
          </button>
          <button
            className={view === "console" ? "active" : ""}
            onClick={() => setView("console")}
          >
            🎮 By Console
          </button>
        </div>

        {!chartData.length ? (
          <p>Loading data...</p>
        ) : (
          <ResponsiveContainer
            width="100%"
            height={view === "console" ? chartData.length * 25 : 500}
          >
            {view === "console" ? (
              <BarChart
                data={chartData}
                layout="vertical"
                margin={{ top: 20, right: 30, left: 100, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis
                  dataKey="category"
                  type="category"
                  width={120}
                  tick={{ fontSize: 11 }}
                  interval={0}
                />
                <Tooltip
                  formatter={(value) => `${value.toFixed(2)} million units`}
                />
                <Legend />
                <Bar
                  dataKey="total_sales"
                  fill="#8884d8"
                  name="Total Sales (Millions)"
                />
              </BarChart>
            ) : (
              <BarChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 100 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey={view === "top" ? "title" : "category"}
                  angle={-45}
                  textAnchor="end"
                  interval={0}
                  height={120}
                />
                <YAxis />
                <Tooltip
                  formatter={(value) =>
                    view === "genre"
                      ? `${Math.round(value)} million units`
                      : `${value.toFixed(2)}`
                  }
                />
                <Legend />
                <Bar
                  dataKey="total_sales"
                  fill="#8884d8"
                  name="Total Sales (Millions)"
                />
                {view === "top" && (
                  <Bar
                    dataKey="critic_score"
                    fill="#82ca9d"
                    name="Critic Score"
                  />
                )}
              </BarChart>
            )}
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

export default ChartsPage;
