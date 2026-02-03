"use client";

import { useState, useEffect } from "react";
import GraficoIcon from "@/public/grafico-icon.svg";
import ChonchitoIcon from "@/public/chonchito-icon.svg";
import TermometroIcon from "@/public/termometro-vacio-icon.svg";
import FlechaIcon from "@/public/flecha-icon.svg";
import RetosIcon from "@/public/retos-icon.svg";

type View = "dashboard" | "estadisticas" | "montos" | "objetivos" | "retos";

interface BottomNavigationProps {
  currentView: View;
  setCurrentView: (view: View) => void;
  buttonColorClass: string;
  textColorClass: string;
  bgColorClass: string;
}

export default function BottomNavigation({
  currentView,
  setCurrentView,
  buttonColorClass,
}: BottomNavigationProps) {
  const isPerson1 = buttonColorClass === "bg-person1-color";
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const checkDarkMode = () => {
      setIsDark(document.documentElement.classList.contains("dark"));
    };
    checkDarkMode();
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  const navItems = [
    { id: "estadisticas" as View, label: "Estadísticas", icon: GraficoIcon },
    { id: "montos" as View, label: "Montos", icon: ChonchitoIcon },
    { id: "dashboard" as View, label: "Dashboard", icon: TermometroIcon },
    { id: "objetivos" as View, label: "Objetivos", icon: FlechaIcon },
    { id: "retos" as View, label: "Retos", icon: RetosIcon },
  ];

  const userColor = isPerson1 ? "#93c5fd" : "#ec93bf";

  const getIconColor = (isActive: boolean) => {
    if (isActive) return userColor;
    return isDark ? "#595959" : "#a3a3a3";
  };

  return (
    <div className="fixed bottom-4 sm:bottom-6 left-0 right-0 flex justify-center z-50">
      <div
        className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 sm:py-3 rounded-full shadow-xl border"
        style={{
          backgroundColor: isDark
            ? "rgb(31, 41, 55, 1)"
            : "rgba(255, 255, 255, 0.95)",
          borderColor: isDark
            ? "rgba(255,255,255,0.10)"
            : "rgba(0,0,0,0.10)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
        }}
      >
        {navItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = currentView === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className="relative flex flex-col items-center justify-center transition-all duration-300 ease-out"
              style={{
                padding: isActive ? "6px 14px" : "6px 8px",
              }}
              title={item.label}
            >
              <IconComponent
                className="relative z-10 transition-all duration-300"
                style={{
                  width: isActive
                    ? "clamp(30px, 5vw, 38px)"
                    : "clamp(28px, 5vw, 35px)",
                  height: isActive
                    ? "clamp(30px, 5vw, 38px)"
                    : "clamp(28px, 5vw, 35px)",
                  fill: getIconColor(isActive),
                  stroke: getIconColor(isActive),
                }}
              />

              <span
                className="relative z-10 mt-1 font-semibold transition-all duration-300 overflow-hidden"
                style={{
                  fontSize: "clamp(9px, 2.5vw, 11px)",
                  color: getIconColor(true),
                  maxHeight: isActive ? 16 : 0,
                  opacity: isActive ? 1 : 0,
                  lineHeight: "16px",
                  whiteSpace: "nowrap",
                }}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
