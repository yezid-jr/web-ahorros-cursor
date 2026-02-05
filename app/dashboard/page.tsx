"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import axios from "axios";
import Termometro from "@/components/Termometro";
import Estadisticas from "@/components/Estadisticas";
import Montos from "@/components/Montos";
import Objetivos from "@/components/Objetivos";
import Retos from "@/components/Retos";
import ThemeToggle from "@/components/ButtonDarkTheme";
import BottomNavigation from "@/components/BottomNavigation";

import API_URL from "@/lib/api";

type View = "dashboard" | "estadisticas" | "montos" | "objetivos" | "retos";

function DashboardContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const userId = parseInt(searchParams.get("user") || "1");
  const [currentView, setCurrentView] = useState<View>("dashboard");
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`${API_URL}/users/${userId}`);
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
    fetchUser();
  }, [userId]);

  const isPerson1 = userId === 1;

  // Clases para los colores basadas en CSS variables
  const bgColorClass = isPerson1 ? "bg-person1" : "bg-person2";
  const textColorClass = isPerson1 ? "text-person1-dark" : "text-person2-dark";
  const buttonColorClass = isPerson1 ? "bg-person1-color" : "bg-person2-color";
  const buttonHoverClass = isPerson1 ? "hover:bg-person1-dark" : "hover:bg-person2-dark";

  if (currentView === "dashboard") {
    return (
      <div className={`min-h-screen ${bgColorClass} transition-colors duration-300`}>
        <div className="container mx-auto px-4 py-8 pb-24 animate-fadeIn">

          {/* Header */}
          <div className="relative text-center mb-10">
            <h1 className={`text-3xl font-bold ${textColorClass}`}>
              Hola, {isPerson1 ? "Yezid" : "Yiss"}
            </h1>
            <div>
              <p className={`mt-2 ${textColorClass}`}>
                Bienvenido de nuevo
              </p>
            </div>
            <div className="absolute top-0 right-0">
              <ThemeToggle />
            </div>
          </div>

          {/* Termómetro centrado */}
          <div className="flex justify-center mb-16">
            <Termometro userId={userId} />
          </div>
        </div>

        <BottomNavigation
          currentView={currentView}
          setCurrentView={setCurrentView}
          buttonColorClass={buttonColorClass}
          textColorClass={textColorClass}
          bgColorClass={bgColorClass}
        />
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${bgColorClass} transition-colors duration-300`}>
      <div className="container mx-auto px-4 py-8 pb-24 animate-fadeIn">
        <div className="flex items-center mb-5">
          <ThemeToggle />
        </div>

        <div className="mt-6">
          {currentView === "estadisticas" && <Estadisticas userId={userId} />}
          {currentView === "montos" && <Montos userId={userId} />}
          {currentView === "objetivos" && <Objetivos userId={userId} />}
          {currentView === "retos" && <Retos userId={userId} />}
        </div>
      </div>

      <BottomNavigation
        currentView={currentView}
        setCurrentView={setCurrentView}
        buttonColorClass={buttonColorClass}
        textColorClass={textColorClass}
        bgColorClass={bgColorClass}
      />
    </div>
  );
}

export default function Dashboard() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Cargando...</div>}>
      <DashboardContent />
    </Suspense>
  );
}