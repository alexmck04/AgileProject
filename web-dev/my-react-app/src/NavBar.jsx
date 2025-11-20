import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar">
      <ul className="navbar-links">
        <li><Link to="/home">Dashboard</Link></li>
        <li><Link to="/charts">Charts</Link></li>
        <li><Link to="/predictor">Game Predictor</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;
