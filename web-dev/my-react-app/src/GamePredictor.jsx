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

  const regions = ["All", "Europe", "NA", "Japan"];

  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState(genres[0]);
  const [platform, setPlatform] = useState(platforms[0]);
  const [region, setRegion] = useState(regions[0]);
  
  const [criticScore, setCriticScore] = useState(70); 
  const [releaseYear, setReleaseYear] = useState(2025); 
  
  const [prediction, setPrediction] = useState(null); 
  const [loading, setLoading] = useState(false);
  
  
  const [lastInputs, setLastInputs] = useState(null);

  
  const API_URL = 'https://predict-sales-zmsrqrwcya-uc.a.run.app'; 

  const handleExport = () => {
    window.print();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setPrediction(null);
    setLastInputs(null);


    
    let regionsList = [];
    if (region === "All") regionsList = ["NA", "EU", "Japan", "Other"];
    else if (region === "Europe") regionsList = ["EU"];
    else if (region === "NA") regionsList = ["NA"];
    else if (region === "Japan") regionsList = ["Japan"];


    
    let finalPlatform = platform;
    if (platform === "MAC") finalPlatform = "OSX";
    if (platform === "PS1") finalPlatform = "PS";


    
    const payload = {
      Genre: genre,
      Platform: finalPlatform,
      Critic_Score: Number(criticScore),
      Release_Year: Number(releaseYear),
      Regions: regionsList
    };


    

    setLastInputs({
        Title: title || 'N/A',
        Genre: genre,
        Platform: platform,
        Year: releaseYear,
        Score: criticScore,
        Region: regionsList.join(', ') || 'None'
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

        
        <input
          type="number"
          placeholder="Release Year (e.g., 2025)"
          value={releaseYear}
          onChange={(e) => setReleaseYear(e.target.value)}
          min="1980"
          max="2030"
          required
        />
        
        
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

        
        <select value={genre} onChange={(e) => setGenre(e.target.value)}>
          {genres.map((g) => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>

        
        <select value={platform} onChange={(e) => setPlatform(e.target.value)}>
          {platforms.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>

        
        <select value={region} onChange={(e) => setRegion(e.target.value)}>
          {regions.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>

        <button type="submit" disabled={loading}>
          {loading ? "Calculating..." : "Predict Sales"}
        </button>
      </form>


      
      {prediction !== null && lastInputs && (
        <div className="prediction-result-box">
          
          <h2 className="prediction-header">Prediction Result Summary</h2>
          
          
          <div className="final-prediction">
            Predicted Global Sales:
            <h1 className="prediction-value">{prediction} Million Units</h1>
          </div>

          <div className="prediction-inputs-table">
            <h3 className="inputs-title">Input Parameters</h3>

            
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