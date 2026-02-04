"use client";

import { useEffect, useState } from "react";
import axios from "axios";

import API_URL from "@/lib/api";

interface EstadisticasData {
  total_mes: number;
  faltante_mes: number;
  total_general: number;
  objetivo_actual: number;
  progreso_porcentaje: number;
}

export default function Estadisticas({ userId }: { userId: number }) {
  const [estadisticas, setEstadisticas] = useState<EstadisticasData | null>(null);

  useEffect(() => {
    const fetchEstadisticas = async () => {
      try {
        const response = await axios.get(`${API_URL}/estadisticas`);
        setEstadisticas(response.data);
      } catch (error) {
        console.error("Error fetching estadisticas:", error);
      }
    };

    fetchEstadisticas();
    const interval = setInterval(fetchEstadisticas);
    return () => clearInterval(interval);
  }, []);

  if (!estadisticas) {
    return <div className="text-center">Cargando estadísticas...</div>;
  }

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 text-center">
        Estadísticas
      </h2>

      <div className="space-y-4">
        <div className="bg-blue-50 dark:bg-blue-900/30 rounded-xl p-4">
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">Total del Mes</p>
          <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
            ${estadisticas.total_mes.toLocaleString("es-CO")}
          </p>
        </div>

        <div className="bg-pink-50 dark:bg-pink-900/30 rounded-xl p-4">
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">Faltante del Mes</p>
          <p className="text-3xl font-bold text-pink-600 dark:text-pink-400">
            ${estadisticas.faltante_mes.toLocaleString("es-CO")}
          </p>
        </div>

        <div className="bg-green-50 dark:bg-green-900/30 rounded-xl p-4">
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">Total General</p>
          <p className="text-3xl font-bold text-green-600 dark:text-green-400">
            ${estadisticas.total_general.toLocaleString("es-CO")}
          </p>
        </div>

        <div className="bg-purple-50 dark:bg-purple-900/30 rounded-xl p-4">
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">Objetivo Actual</p>
          <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
            ${estadisticas.objetivo_actual.toLocaleString("es-CO")}
          </p>
          <div className="mt-2">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
              <div
                className="bg-purple-600 dark:bg-purple-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(estadisticas.progreso_porcentaje, 100)}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 text-center">
              {estadisticas.progreso_porcentaje.toFixed(1)}% completado
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
