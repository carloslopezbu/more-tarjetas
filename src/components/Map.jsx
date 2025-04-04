import React from "react";
import ElectricComponents from "./ElectricComponents";

const mapStyle =
    "w-[70%] h-[80%] bg-gray-200 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 " +
    "rounded-md shadow-lg overflow-hidden " +
    "bg-[radial-gradient(circle,_#ccc_1px,_transparent_1px)] " +
    "bg-[size:20px_20px]";

export default function Map({ onClick, components, onValueChange }) {
    return (
        <div className={mapStyle} onClick={onClick}>
            {components.map((component) => (
                <ElectricComponents
                    key={component.id}
                    type={component.type}
                    value={component.value}
                    x={component.x}
                    y={component.y}
                    onValueChange={(newValue) => onValueChange(component.id, newValue)}
                />
            ))}
        </div>
    );
}