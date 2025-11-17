function Navbar() {
  return (
    <>
        <nav className="navbar">
            
            <ul className="navbar-links">
                <li><a href="/dashboard">Dashboard</a></li>
                <li><a href="/charts">Charts</a></li>
                <li><a href="game-predictor">Game Predictor</a></li>
                
            </ul>
        </nav>
    </>
  );
}

export default Navbar;