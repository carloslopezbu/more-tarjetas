import { Routes, Route, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  const [loggedIn, setLoggedIn] = useState(() => {
    return localStorage.getItem("loggedIn") === "true";
  });
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem("loggedIn", loggedIn);
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    }
  }, [loggedIn, user]);

  useEffect(() => {
    if (loggedIn) {
      navigate("/home");
    }
  }, [loggedIn, navigate]);

  return (
    <Routes>
      <Route path="/" element={<Login setLoggedIn={setLoggedIn} setUser={setUser} />} />
      <Route
        path="/home"
        element={
          <ProtectedRoute loggedIn={loggedIn}>
            <Dashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}