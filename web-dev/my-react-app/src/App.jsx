import Header from './Header'
import Welcomepage from './Welcomepage'
import HomePage from './HomePage'
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Registerpage from "./Registerpage";
import Loginpage from "./Loginpage";
import ChartsPage from "./ChartsPage";
import GamePredictor from "./GamePredictor";

function Layout() {
  const location = useLocation();

  // Pages where NAV should NOT appear
  const hideNavbarRoutes = ["/login", "/register", "/"];

  const shouldHideNavbar = hideNavbarRoutes.includes(location.pathname);

  return (
    <>
      {!shouldHideNavbar && <Header />} 

      <Routes>
        <Route path="/" element={<Welcomepage />} />
        <Route path="/home" element={<HomePage />} />

        <Route path="/register" element={<Registerpage />} />
        <Route path="/login" element={<Loginpage />} />

        <Route path="/charts" element={<ChartsPage />} />
        <Route path="/predictor" element={<GamePredictor />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}

export default App;
