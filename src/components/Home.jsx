import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { HomeIcon } from "lucide-react";

export default function Home() {
    const navigate = useNavigate();
    
    const handleClick = () => {
        navigate("/home");
    };
    
    return (
        <div style={{ position: "fixed", bottom: "20px", right: "20px" }}>
            <Button onClick={handleClick} className="bg-rose-500 text-white hover:bg-rose-700 transition duration-300 ease-in-out" variant="secondary">
                <HomeIcon />
            </Button>
        </div>
    );
    }