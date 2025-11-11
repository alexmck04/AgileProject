

import Header from './Header'
import Welcomepage from './Welcomepage'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Registerpage from "./Registerpage";
import Loginpage from "./Loginpage";

//charts page
import ChartsPage from "./ChartsPage";


function App() {

  return (
    <Router>
      {/* Display the header on all pages*/}
      <Header />
      <Routes>
        {/* Define routes for the application */}
        <Route path="/" element={<Welcomepage />} />
        <Route path="/register" element={<Registerpage />} />
        <Route path="/login" element={<Loginpage />} />
      
        <Route path="/charts" element={<ChartsPage />} />


      </Routes>
    </Router>
  )
}

export default App