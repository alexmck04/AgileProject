import { useState } from "react";

function GamePredictor() {

  // defines all the inputs for the selectors 
  const genres = [
    "Action", "Action-Adventure", "Adventure", "Board Game", "Education",
    "Fighting", "MMO", "Misc", "Music", "Party", "Platform", "Puzzle",
    "Racing", "Role-Playing", "Sandbox", "Shooter", "Simulation",
    "Sports", "Strategy", "Visual Novel"
  ];

  const platforms = [
    "3DS","DC","DS","GB","GBA","GC","GEN","MAC","N64","NES","NG","PC","PS1",
    "PS2","PS3","PS4","PS5","PSP","PSV","SAT","SCD","SNES","VC","WS","WW",
    "Wii","WiiU","X360","XB","XBL","XOne","XS","iOS"
  ];

  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState(genres[0]);
  const [platform, setPlatform] = useState(platforms[0]);
  // Region state removed as it is now static
  
  const [criticScore, setCriticScore] = useState(70); 
  const [releaseYear, setReleaseYear] = useState(2025); 
  
  const [prediction, setPrediction] = useState(null); 
  const [loading, setLoading] = useState(false);
  
  // stores inputs
  const [lastInputs, setLastInputs] = useState(null);

  // url for predictor
  const API_URL = 'https://predict-sales-zmsrqrwcya-uc.a.run.app'; 

  const handleExport = () => {
    window.print();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setPrediction(null);
    setLastInputs(null);

    // Region logic is now static: All Regions
    const regionsList = ["NA", "EU", "Japan", "Other"];

    // fixing naming
    let finalPlatform = platform;
    if (platform === "MAC") finalPlatform = "OSX";
    if (platform === "PS1") finalPlatform = "PS";

    // creating payload
    const payload = {
      Genre: genre,
      Platform: finalPlatform,
      Critic_Score: Number(criticScore),
      Release_Year: Number(releaseYear),
      Regions: regionsList
    };

    // inputs defined
    setLastInputs({
        Title: title || 'N/A',
        Genre: genre,
        Platform: platform,
        Year: releaseYear,
        Score: criticScore,
        Region: 'Global (All Regions)'
    });

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`API Error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      setPrediction(data.predicted_sales);
    } catch (error) {
      console.error("Error predicting:", error);
      alert("Failed to get prediction. Check console for details.");
    }

    setLoading(false);
  };

  return (
    <div className="login-body">
      <h1>Game Sales Predictor</h1>

      <form onSubmit={handleSubmit}>

        <input
          type="text"
          placeholder="Enter game title (ID only)..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        {/* release year */}
        <input
          type="number"
          placeholder="Release Year (e.g., 2025)"
          value={releaseYear}
          onChange={(e) => setReleaseYear(e.target.value)}
          min="1980"
          max="2030"
          required
        />
        
        {/* critic score */}
        <div className="input-group">
          <label className="score-label">Critic Score (0-100): {criticScore}</label>
          <input 
            type="range" 
            min="0" max="100" 
            value={criticScore} 
            onChange={(e) => setCriticScore(e.target.value)} 
            className="score-range"
          />
        </div>

        {/* genre selector */}
        <select value={genre} onChange={(e) => setGenre(e.target.value)}>
          {genres.map((g) => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>

        {/* platform selector */}
        <select value={platform} onChange={(e) => setPlatform(e.target.value)}>
          {platforms.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>

        {/* region text */}
        <div style={{ margin: "15px 0", color: "#e0e0e0", fontWeight: "bold" }}>
            Game will be released in all regions
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Calculating..." : "Predict Sales"}
        </button>
      </form>

      {/* prediction display */}
      {prediction !== null && lastInputs && (
        <div className="prediction-result-box">
          
          <h2 className="prediction-header">Prediction Result Summary</h2>
          
          {/* show final prediction with absolute value to prevent negative numbers */}
          <div className="final-prediction">
            Predicted Global Sales:
            <h1 className="prediction-value">{Math.abs(prediction)} Million Units</h1>
          </div>

          <div className="prediction-inputs-table">
            <h3 className="inputs-title">Input Parameters</h3>

            {/* maps inputs to a structured list for easier printing */}
            {Object.entries(lastInputs).map(([key, value]) => (
                <div key={key} className="input-row">
                    <span className="input-label">{key}:</span>
                    <span className="input-value">{value}</span>
                </div>
            ))}
          </div>
          
          <button onClick={handleExport} className="export-button">Export / Print Results</button>
        </div>
      )}
    </div>
  );
}

export default GamePredictor;