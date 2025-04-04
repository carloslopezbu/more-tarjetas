import React, { useState } from "react";
import { IconCircuitDiode, IconCircuitCellPlus, IconCircuitResistor, IconWaveSine } from "@tabler/icons-react";

export const EComponentsIcons = {
    diode: IconCircuitDiode,
    battery: IconCircuitCellPlus,
    resistor: IconCircuitResistor,
    sine: IconWaveSine,
};

const EComponentMeasures = {
    battery: "V",
    resistor: "Ω",
    sine: "Hz",
    diode: "",
};

const ElectricComponents = React.memo(function ElectricComponents({ type, value, x, y, onValueChange }) {
    const [inputValue, setInputValue] = useState(value); // Estado local para manejar el valor del input

    if (!EComponentsIcons[type]) {
        console.error(`Tipo de componente desconocido: ${type}`);
        return null;
    }

    const Icon = EComponentsIcons[type];

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            onValueChange(inputValue); // Confirma el cambio al presionar Enter
            e.target.blur(); // Pierde el foco después de confirmar
        }
    };

    return (
        <div
            className="absolute flex flex-col items-center"
            style={{ left: x, top: y, transform: "translate(-50%, -50%)" }}>
            <Icon size={40} />
            
            {(type !== "diode") && (
                <input
                    type="number"
                    className="text-sm max-w-12 mt-1 text-center border border-gray-300 rounded"
                    value={inputValue}
                    onClick={(e) => e.stopPropagation()} // Evita que el clic en el input cree un nuevo componente
                    onChange={(e) => setInputValue(e.target.value)} // Actualiza el estado local
                    onKeyDown={handleKeyDown} // Maneja la tecla Enter
                />
            )}
        </div>
    );
});

export default ElectricComponents;