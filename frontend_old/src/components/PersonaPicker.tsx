// src/components/PersonaPicker.tsx
import React from "react";
import { PERSONAS } from "../constants";
import { useAppContext } from "../context/AppContext";

const PersonaPicker: React.FC<{ onCustomClick: () => void }> = ({ onCustomClick }) => {
  const { persona, setPersona } = useAppContext();

  return (
    <div className="mb-4">
      <div className="text-sm font-medium text-stone-600 mb-2">Analyze as a…</div>
      <div className="flex flex-wrap gap-2">
        {PERSONAS.map((p) => {
          const isActive = p.key === persona;
          return (
            <button
              key={p.key}
              type="button"
              onClick={() => {
                if (p.key === "custom") onCustomClick();
                setPersona(p.key);
              }}
              className={`chip ${isActive ? "chip-active" : "chip-idle"}`}
            >
              {p.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default PersonaPicker;
