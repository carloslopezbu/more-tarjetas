
import React, { useState } from "react";
import { EComponentsIcons } from "./ElectricComponents";

const buttonStyle = "w-15 h-15 p-3 bg-gray-200 rounded-md hover:bg-gray-300 flex items-center justify-center";

export default function Select({ selectedButton, setSelectedButton }) {

    const handleButtonClick = (button) => {
        setSelectedButton(button);
    };

    const getButtonStyle = (button) => {
        return `${buttonStyle} ${selectedButton === button ? "ring-4 ring-blue-500" : ""}`;
    };

    const EComponentsName = EComponentsIcons ? Object.keys(EComponentsIcons) : []

    return (
        <aside className="w-[5%] h-[60%] bg-gray-300 absolute top-1/2 right-24 transform -translate-y-1/2 
                                        rounded-md grid grid-cols-1 gap-2 p-2">

            {EComponentsName.map((component) => {
                const Icon = EComponentsIcons[component]
                return (
                    <button className={getButtonStyle(component)} onClick={() => handleButtonClick(component)}>
                        <Icon size={20}/>
                    </button>
                )
            })}
        </aside>
    );
}