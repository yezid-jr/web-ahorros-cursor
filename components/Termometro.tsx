"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import API_URL from "@/lib/api";

interface Estadisticas {
  total_general: number;
  objetivo_actual: number;
  progreso_porcentaje: number;
}

export default function Termometro({ userId }: { userId: number }) {
  const [estadisticas, setEstadisticas] = useState<Estadisticas | null>(null);
  const [showPercentage, setShowPercentage] = useState(false);
  const [displayPercentaje, setDisplayPercentaje] = useState(0);

  useEffect(() => {
    const fetchEstadisticas = async () => {
      try {
        const res = await axios.get(`${API_URL}/estadisticas`);
        setEstadisticas(res.data);
      } catch (error) {
        console.error("Error fetching estadisticas:", error);
      }
    };

    fetchEstadisticas();
  }, []);

  // Animación del líquido
  useEffect(() => {
    if (estadisticas) {
      const targetPercentaje = Math.min(estadisticas.progreso_porcentaje, 100);
      let currentPercentaje = 0;
      const increment = targetPercentaje / 20;

      const animationInterval = setInterval(() => {
        currentPercentaje += increment;
        if (currentPercentaje >= targetPercentaje) {
          setDisplayPercentaje(targetPercentaje);
          clearInterval(animationInterval);
        } else {
          setDisplayPercentaje(currentPercentaje);
        }
      }, 66);

      return () => clearInterval(animationInterval);
    }
  }, [estadisticas]);

  if (!estadisticas) {
    return <div className="text-sm text-gray-500 dark:text-gray-400">Cargando...</div>;
  }

  const objetivoActual = estadisticas.objetivo_actual;

  // Colores según el usuario
  const isPerson1 = userId === 1;
  const gradientColors = isPerson1
    ? "from-blue-500 to-sky-400"
    : "from-pink-400 to-rose-400";

  return (
    <div className="flex flex-col items-center p-12">
      {/* Termómetro minimalista */}
      <div
        className="relative flex flex-col items-center cursor-pointer py-8"
        onClick={() => setShowPercentage(!showPercentage)}
      >
        {/* Indicador de porcentaje al hacer click */}
        {showPercentage && (
          <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-full bg-white dark:bg-gray-800 shadow-lg border-2 border-gray-200 dark:border-gray-600 animate-in fade-in">
            <p className={`text-3xl font-bold bg-gradient-to-r ${gradientColors} bg-clip-text text-transparent`}>
              {displayPercentaje.toFixed(1)}%
            </p>
          </div>
        )}

        {/* Barra vertical del termómetro */}
        <div className="relative h-80 w-28 bg-gray-200 dark:bg-gray-700 rounded-full shadow-lg border-4 border-gray-300 dark:border-gray-600 overflow-hidden">
          {/* Líquido animado */}
          <div
            className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t ${gradientColors} transition-all duration-1000 ease-out rounded-b-full`}
            style={{ height: `${displayPercentaje}%` }}
          />
        </div>

        {/* Info debajo */}
        <div className="mt-8 text-center">
          <p className="text-lg text-gray-600 dark:text-gray-200 font-semibold">
            ${objetivoActual.toLocaleString("es-CO")}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Objetivo</p>
        </div>
      </div>
    </div>
  );
}