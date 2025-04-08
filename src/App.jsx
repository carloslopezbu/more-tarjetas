import { Routes, Route } from "react-router-dom";
import Login from "./components/Login";

export default function App() {
    return (
        // <Routes>
        <Routes>
            <Route path="/" element={<Login />} />
        </Routes>
    );
}
