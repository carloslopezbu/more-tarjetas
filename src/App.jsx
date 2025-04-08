import { Routes, Route, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Login from "./components/Login";
import User from "./components/User";

export default function App() {
    const [loggedIn, setLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    // Redirigir a /home si loggedIn es true
    useEffect(() => {
        if (loggedIn)
            navigate("/home");
        
    }, [loggedIn, navigate]);

    return (
        <Routes>
            <Route path="/" element={<Login setLoggedIn={setLoggedIn} setUser={setUser} />} />
            <Route path="/home" element={<User />} />
        </Routes>
    );
}