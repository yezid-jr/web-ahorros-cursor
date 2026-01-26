"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import axios from "axios";
import Termometro from "@/components/Termometro";
import Estadisticas from "@/components/Estadisticas";
import Montos from "@/components/Montos";
import Objetivos from "@/components/Objetivos";
import Retos from "@/components/Retos";

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
  const bgColor = isPerson1 ? "bg-blue-50" : "bg-pink-50";
  const primaryColor = isPerson1 ? "bg-blue-500" : "bg-pink-500";
  const hoverColor = isPerson1 ? "hover:bg-blue-600" : "hover:bg-pink-600";
  const textColor = isPerson1 ? "text-blue-700" : "text-pink-700";

  if (currentView === "dashboard") {
    return (
      <div className={`min-h-screen ${bgColor} pb-20`}>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className={`text-3xl font-bold ${textColor} mb-6`}>
              Dashboard {user?.name || ""}
            </h1>
          </div>
          <div className="w-full flex justify-center mb-8">
            <Termometro userId={userId} />
          </div>

          <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
            <button
              onClick={() => setCurrentView("estadisticas")}
              className={`${primaryColor} ${hoverColor} text-white font-semibold py-6 px-4 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg`}
            >
              📊 Estadísticas
            </button>
            <button
              onClick={() => setCurrentView("montos")}
              className={`${primaryColor} ${hoverColor} text-white font-semibold py-6 px-4 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg`}
            >
              💵 Montos
            </button>
            <button
              onClick={() => setCurrentView("objetivos")}
              className={`${primaryColor} ${hoverColor} text-white font-semibold py-6 px-4 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg`}
            >
              🎯 Objetivos
            </button>
            <button
              onClick={() => setCurrentView("retos")}
              className={`${primaryColor} ${hoverColor} text-white font-semibold py-6 px-4 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg`}
            >
              🎲 Retos
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${bgColor} pb-20`}>
      <div className="container mx-auto px-4 py-8">
        <button
          onClick={() => setCurrentView("dashboard")}
          className={`${primaryColor} ${hoverColor} text-white font-semibold py-3 px-6 rounded-xl mb-6 shadow-lg`}
        >
          ← Volver
        </button>

        {currentView === "estadisticas" && <Estadisticas userId={userId} />}
        {currentView === "montos" && <Montos userId={userId} />}
        {currentView === "objetivos" && <Objetivos userId={userId} />}
        {currentView === "retos" && <Retos userId={userId} />}
      </div>
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
