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
    const interval = setInterval(fetchEstadisticas, 5000); // Actualizar cada 5 segundos
    return () => clearInterval(interval);
  }, []);

  if (!estadisticas) {
    return <div className="text-center">Cargando...</div>;
  }

  const porcentaje = Math.min(estadisticas.progreso_porcentaje, 100);
  const objetivos = [1000000, 2000000, 3000000, 5000000, 7000000, 12000000, 20000000];
  const objetivoActual = estadisticas.objetivo_actual;

  return (
    <div className="flex flex-col items-center mt-8 w-full">
      <div className="text-center mb-4">
        <p className="text-2xl font-bold text-gray-800">
          ${estadisticas.total_general.toLocaleString("es-CO")}
        </p>
        <p className="text-sm text-gray-600">
          Objetivo: ${objetivoActual.toLocaleString("es-CO")}
        </p>
      </div>

      {/* Termómetro */}
      <div className="relative w-24 h-80 bg-gray-200 rounded-full border-4 border-gray-300 overflow-hidden mx-auto mb-12">
        {/* Líneas de objetivos */}
        {objetivos.map((obj, index) => {
          if (obj > objetivoActual) return null;
          const pos = (obj / objetivoActual) * 100;
          return (
            <div
              key={obj}
              className="absolute left-0 right-0 border-t-2 border-gray-400"
              style={{ bottom: `${pos}%` }}
            >
              <span className="absolute -left-20 text-xs text-gray-600">
                ${(obj / 1000000).toFixed(0)}M
              </span>
            </div>
          );
        })}

        {/* Líquido del termómetro */}
        <div
          className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-blue-500 to-pink-500 transition-all duration-1000 ease-out"
          style={{ height: `${porcentaje}%` }}
        >
          <div className="absolute inset-0 bg-white bg-opacity-20"></div>
        </div>

        {/* Bulbo del termómetro */}
        <div
          className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-pink-500 border-4 border-gray-300"
          style={{
            background: porcentaje >= 100
              ? "linear-gradient(135deg, #10b981, #3b82f6)"
              : "linear-gradient(135deg, #3b82f6, #ec4899)",
          }}
        ></div>
      </div>

      <div className="mt-4 text-center">
        <div className="text-lg font-semibold text-gray-700">
          {porcentaje.toFixed(1)}%
        </div>
      </div>
    </div>
  );
}
