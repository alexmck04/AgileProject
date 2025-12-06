// Charts Page

import { useEffect, useState, useRef } from "react";
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
  PieChart,
  Pie,
  Cell,
} from "recharts";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

function ChartsPage() {
  const chartRef = useRef(null);
  const [rawData, setRawData] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [view, setView] = useState("top");

  const [sortColumn, setSortColumn] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");

  // Load CSV
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

  // Process chart data
  useEffect(() => {
    if (!rawData.length) return;


    // ---------- TOP 20 GAMES ----------
    if (view === "top" || view === "table") {
      const cleaned = rawData
        .map((r) => ({
          title: r.title,
          console: r.console,
          genre: r.genre,
          publisher: r.publisher,
          developer: r.developer,
          critic_score: (parseFloat(r.critic_score)).toFixed(1),
          total_sales: parseFloat(r.total_sales),
          release_date: r.release_date,
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

    // ---------- BY GENRE ----------
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

    // ---------- BY CONSOLE (DONUT) ----------
    if (view === "console") {
      const grouped = {};

      rawData.forEach((r) => {
        const console = r.console?.trim() || "Unknown";
        const sales = parseFloat(r.total_sales) || 0;
        grouped[console] = (grouped[console] || 0) + sales;
      });

      let arr = Object.entries(grouped).map(([console, total_sales]) => ({
        console,
        total_sales,
      }));

      // Only keep consoles with ≥ 50M
      arr = arr.filter((c) => c.total_sales >= 50);

      // Show only the top 22 consoles (clean chart)
      arr = arr
        .sort((a, b) => b.total_sales - a.total_sales)
        .slice(0, 22);

      setChartData(arr);
    }
  }, [rawData, view]);

  // Colors for pie slices
  const COLORS = [
    "#8884d8", "#82ca9d", "#ffc658", "#ff8042",
    "#8dd1e1", "#a4de6c", "#d0ed57", "#ffc0cb", "#b0c4de",
    "#FF6F61", "#6B5B95", "#88B04B", "#F7CAC9", "#92A8D1",
    "#955251", "#B565A7", "#009B77", "#DD4124", "#45B8AC",
  ];

  // Bigger Donut Chart Component
  const DonutChart = ({ data }) => (
    <ResponsiveContainer width="100%" height={700}>
      <PieChart>
        <Tooltip formatter={(value) => `${Math.round(value)} million units`} />
        <Legend />

        <Pie
          data={data}
          dataKey="total_sales"
          nameKey="console"
          cx="50%"
          cy="50%"
          innerRadius={150}
          outerRadius={260}
          paddingAngle={3}
          label={(entry) => entry.console} // ✔ Only console name
        >
          {data.map((entry, index) => (
            <Cell key={index} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );

   // Export chart as PDF
  const handleSavePDF = async () => {
    const element = chartRef.current;
    if (!element) return;

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
    });

    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "px",
      format: [canvas.width, canvas.height],
    });

    pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
    pdf.save(`chart-${view}.pdf`);
  };

  const handleSort = (column) => {
  if (sortColumn === column) {
    // Toggle sort order
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  } else {
    setSortColumn(column);
    setSortOrder("asc");
  }
};

let tableData = [...chartData];

if (view === "table" && sortColumn) {
  tableData.sort((a, b) => {
    const valA = a[sortColumn];
    const valB = b[sortColumn];

    // Numeric compare
    if (!isNaN(valA) && !isNaN(valB)) {
      return sortOrder === "asc" ? valA - valB : valB - valA;
    }

    // String compare
    return sortOrder === "asc"
      ? String(valA).localeCompare(String(valB))
      : String(valB).localeCompare(String(valA));
  });
}

const renderSortArrow = (column) => {
  if (sortColumn !== column) return null;
  return sortOrder === "asc" ? " ▲" : " ▼";
};


  return (
    <div className="page-wrapper">
      <div className="chart-container">
        <div className="chart-header">
          <h1>Game Sales Charts</h1>
        </div>

        {/* Buttons */}
        <div className="chart-buttons">
          <button className={view === "top" ? "active" : ""} onClick={() => setView("top")}>
            Top Games
          </button>

          <button className={view === "genre" ? "active" : ""} onClick={() => setView("genre")}>
            By Genre
          </button>

          <button className={view === "console" ? "active" : ""} onClick={() => setView("console")}>
            By Console
          </button>

           <button className={view === "table" ? "active" : ""} onClick={() => setView("table")}>
            Table View
          </button>

        </div>

        {/* Chart */}
        <div className="chart-content" ref={chartRef}>
        {!chartData.length ? (
          <p>Loading data...</p>
        ) : view === "console" ? (
          <DonutChart data={chartData} />
        ) : view === "table" ? (
            <table>
       <thead>
  <tr>
    <th onClick={() => handleSort("rank")}>
      Rank{renderSortArrow("rank")}
    </th>
    <th onClick={() => handleSort("title")}>
      Title{renderSortArrow("title")}
    </th>
    <th onClick={() => handleSort("console")}>
      Console{renderSortArrow("console")}
    </th>
    <th onClick={() => handleSort("genre")}>
      Genre{renderSortArrow("genre")}
    </th>
    <th onClick={() => handleSort("publisher")}>
      Publisher{renderSortArrow("publisher")}
    </th>
    <th onClick={() => handleSort("developer")}>
      Developer{renderSortArrow("developer")}
    </th>
    <th onClick={() => handleSort("critic_score")}>
      Critic Score{renderSortArrow("critic_score")}
    </th>
    <th onClick={() => handleSort("total_sales")}>
      Total Sales (M){renderSortArrow("total_sales")}
    </th>
    <th onClick={() => handleSort("release_date")}>
      Release Date{renderSortArrow("release_date")}
    </th>
  </tr>
</thead>
              <tbody>
                {tableData.map((game, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td id="game-title-cell">
                     <a href={`https://www.google.com/search?q=${encodeURIComponent(game.title)}`} target="_blank" rel="noopener noreferrer"> 
                    {game.title}</a></td>
                    <td>{game.console}</td>
                    <td>{game.genre}</td>
                    <td>{game.publisher}</td>
                    <td>{game.developer}</td>
                    <td>{game.critic_score}</td>
                    <td>{game.total_sales}</td>
                    <td>{game.release_date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
          <ResponsiveContainer width="100%" height={500}>
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 60, left: 100, bottom: 100 }}
            >
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis
                dataKey={view === "top" ? "title" : "category"}
                angle={-45}
                textAnchor="end"
                fontSize={10}
                interval={0}
                height={115}
              />

              <YAxis
                domain={view === "top" ? [0, 30] : [0, 1250]}
                tickCount={10}
                allowDecimals={false}
                label={{
                  value: "Sales (Millions)",
                  position: "insideTopLeft",
                  dx: -100,
                }}
              />

              {view === "top" && (
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  domain={[0, 10]}
                  tickCount={11}
                  allowDecimals={false}
                  label={{
                    value: "Critic Score",
                    position: "insideTopRight",
                    dx: 60,
                  }}
                />
              )}

              <Tooltip formatter={(value) => `${Math.round(value)} million units`} />
                <Legend 
                  verticalAlign="top"
                />
              

              <Bar dataKey="total_sales" fill="#8884d8" name="Total Sales (Millions)" />
              {view === "top" && (
                <Bar yAxisId="right" dataKey="critic_score" fill="#82ca9d" name="Critic Score" />
              )}
            </BarChart>
          </ResponsiveContainer>
        )}
        </div>
        <div className="pdf-button-container">
        <button id='pdf-button' onClick={handleSavePDF}>Save Chart as PDF</button>
        </div>
      </div>
    </div>
  );
}

export default ChartsPage;
