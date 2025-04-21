import { Routes, Route, useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import TaskListManager from "./components/TaskListManager";
import PasswordManager from "./components/PasswordManager";
import PhotoManager from "./components/PhotoManager";
// import WeatherCard from "./components/Weather";

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
      <Route
        path="/tasklist/"
        element={
          <ProtectedRoute loggedIn={loggedIn}>
            <TaskListManager />
          </ProtectedRoute>
        }
      />
      <Route
        path="/passwords/"
        element={
          <ProtectedRoute loggedIn={loggedIn}>
            <PasswordManager />
          </ProtectedRoute>
        }
      />

      <Route
        path="/photos/"
        element={
          <ProtectedRoute loggedIn={loggedIn}>
            <PhotoManager />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}