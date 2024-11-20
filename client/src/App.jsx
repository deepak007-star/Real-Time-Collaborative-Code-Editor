import { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import HomePage from "./components/pages/HomePage";
import Room from "./components/pages/Room";
import Dashboard from "./components/pages/Dashboard";
import LoginForm from "./components/auth/LoginForm";
import RegisterForm from "./components/auth/RegisterForm"

function App() {
  return (
    <>
        <Routes>
          <Route path="/" element={<HomePage/>}/>
          <Route path="/dashboard" element={<Dashboard/>}/>
          <Route path="/room" element={<Room/>}/>
          <Route path="/login" element={<LoginForm/>}/>
          <Route path="/register" element={<RegisterForm/>}/>
        </Routes>
    </>
  );
}

export default App;
