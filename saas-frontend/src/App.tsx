import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import ClientDashboard from "./pages/ClientDashboard";
import ConsultantForm from "./pages/ConsultantForm";
// import ClientForm from "./pages/ClientForm";
import Consultants from "./pages/Consultants";

import './index.css';
//import AuthCallback from "./pages/AuthCallback";
import LandingPage from "./pages/LandingPage";


function App() {
  return (
    <Router>
     <Routes>
  <Route path="/" element={<LandingPage />} />
  <Route path="/login" element={<Login />} />
  <Route path="/client-dashboard" element={<ClientDashboard />} />
  <Route path="/consultant-form" element={<ConsultantForm />} />
  {/* <Route path="/client-form" element={<ClientForm />} /> */}
  <Route path="/consultants" element={<Consultants />} />
</Routes>
    </Router>
  );
}

export default App;
