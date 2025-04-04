import React, { useState, useEffect } from "react";
import Select from "./Select";
import Map from "./Map";

export default function Simulator() {
    const [selectedButton, setSelectedButton] = useState(null);
    const [components, setComponents] = useState([]);

    const handleMapClick = (event) => {
        if (selectedButton) {
            const rect = event.target.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;

            setComponents((prevComponents) => [
                ...prevComponents,
                { id: prevComponents.length, type: selectedButton, x, y, value: 100 },
            ]);
        }
    };

    const handleValueChange = (id, newValue) => {
        setComponents((prevComponents) =>
            prevComponents.map((component) =>
                component.id === id ? { ...component, value: newValue } : component
            )
        );
    };

    return (
        <div className="w-screen h-screen bg-gray-100 flex items-center justify-center">
            <Select selectedButton={selectedButton} setSelectedButton={setSelectedButton} />
            <Map onClick={handleMapClick} components={components} onValueChange={handleValueChange} />
        </div>
    );
}