import { useState } from "react";

function GamePredictor() {

  const genres = [
    "Action", "Action-Adventure", "Adventure", "Board Game", "Education",
    "Fighting", "MMO", "Misc", "Music", "Party", "Platform", "Puzzle",
    "Racing", "Role-Playing", "Sandbox", "Shooter", "Simulation",
    "Sports", "Strategy", "Survival", "Visual Novel"
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
  const [prediction, setPrediction] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const sampleSales = (Math.random() * 100).toFixed(2);


setPrediction({
title,
genre,
platform,
region,
sales: sampleSales
});
  };

  return (
    <div className="login-body">
      <h1>Game Predictor</h1>

    { !prediction ? (
      <form onSubmit={handleSubmit}>

        <input
          type="text"
          placeholder="Enter game title..."
          autoComplete="off"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

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

        <button type="submit">Predict</button>
      </form>
    ) : (
      <div className="prediction-results">
<h2>Prediction Result</h2>
<p><span>Title:</span> {prediction.title}</p>
<p><span>Genre:</span> {prediction.genre}</p>
<p><span>Platform:</span> {prediction.platform}</p>
<p><span>Region:</span> {prediction.region}</p>
<p><span>Predicted Sales:</span> {prediction.sales} Million</p>


<button
onClick={() => setPrediction(null)}
>
Predict Again
</button>
</div>
    )}
    
    </div>
  );
}

export default GamePredictor;
