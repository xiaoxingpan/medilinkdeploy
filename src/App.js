import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./Index.css";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import UserProfile from "./pages/UserProfile";

import GlobalStyles from "./styles/GlobalStyles";
import MiniDrawer from "./pages/AdminCenter";

import Pay from "./pages/Pay";
import PaymentResult from "./pages/PaymentResult";
import VideoChat from "./pages/VideoChat";

import Prescription from "./pages/Prescription";
import ShowPdf from "./pages/ShowPdf";
import DoctorSchedule from "./pages/DoctorSchedule";
import WebFont from "webfontloader";
import { useEffect } from "react";

function App() {
  return (
    <>
      <GlobalStyles />
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Signup" element={<Signup />} />
          <Route path="/Admin" element={<MiniDrawer />} />
          <Route path="/Pay" element={<Pay />} />
          <Route path="/payment_result/:appointmentId" element={<PaymentResult />} />
          <Route path="/Prescription" element={<Prescription />} />
          <Route path="/ShowPdf" element={<ShowPdf />} />
          <Route path="/DoctorSchedule" element={<DoctorSchedule />} />
          <Route path="/VideoChat/:appointmentId" element={<VideoChat />} />
          <Route path="/users/profile" element={<UserProfile />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
