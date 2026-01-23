"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import retosData from "@/data/retos.json";
import { isSameDay, isAfter, addDays, startOfMonth, getDate } from "date-fns";

import API_URL from "@/lib/api";

interface Reto {
  id: number;
  description: string;
  date: string;
  completed_user1: boolean;
  completed_user2: boolean;
  penitencia_applied: boolean;
}

export default function Retos({ userId }: { userId: number }) {
  const [retos, setRetos] = useState<Reto[]>([]);
  const [retoActual, setRetoActual] = useState<any>(null);
  const [penitencia, setPenitencia] = useState<string | null>(null);

  useEffect(() => {
    fetchRetos();
    checkRetoActual();
    const interval = setInterval(() => {
      fetchRetos();
      checkRetoActual();
    }, 60000); // Actualizar cada minuto
    return () => clearInterval(interval);
  }, []);

  const fetchRetos = async () => {
    try {
      const response = await axios.get(`${API_URL}/retos`);
      setRetos(response.data);
    } catch (error) {
      console.error("Error fetching retos:", error);
    }
  };

  const checkRetoActual = async () => {
    const today = new Date();
    const day = getDate(today);
    
    // Retos se activan el día 1 y 15 de cada mes
    if (day === 1 || day === 15) {
      try {
        // Buscar reto actual en el backend
        const response = await axios.get(`${API_URL}/retos/actual`);
        if (response.data.reto) {
          setRetoActual(response.data.reto);
          
          // Verificar si pasaron 15 días y no se completó
          const fechaLimite = addDays(new Date(response.data.reto.date), 15);
          if (isAfter(today, fechaLimite)) {
            if (!response.data.reto.completed_user1 || !response.data.reto.completed_user2) {
              if (!response.data.reto.penitencia_applied) {
                // Aplicar penitencia aleatoria
                const penitencias = retosData.penitencias;
                const penitenciaAleatoria = penitencias[Math.floor(Math.random() * penitencias.length)];
                setPenitencia(penitenciaAleatoria);
              }
            }
          }
        } else {
          // Crear nuevo reto si no existe
          const retosDisponibles = retosData.retos.filter(
            (r) => !retos.some((dbReto) => dbReto.description === r.descripcion)
          );
          if (retosDisponibles.length > 0) {
            const retoAleatorio =
              retosDisponibles[
                Math.floor(Math.random() * retosDisponibles.length)
              ];
            
            const createResponse = await axios.post(
              `${API_URL}/retos/crear?description=${encodeURIComponent(retoAleatorio.descripcion)}`
            );
            setRetoActual(createResponse.data);
          }
        }
      } catch (error) {
        console.error("Error checking reto actual:", error);
      }
    }
  };

  const handleCompleteReto = async () => {
    if (!retoActual || !retoActual.id) return;

    try {
      await axios.post(`${API_URL}/retos/${retoActual.id}/complete?user_id=${userId}`);
      fetchRetos();
      checkRetoActual();
    } catch (error) {
      console.error("Error completing reto:", error);
    }
  };

  const getRetoStatus = () => {
    if (!retoActual) return null;
    
    if (retoActual.completed_user1 && retoActual.completed_user2) {
      return "completed";
    }
    
    if (userId === 1 && retoActual.completed_user1) {
      return "waiting_partner";
    }
    
    if (userId === 2 && retoActual.completed_user2) {
      return "waiting_partner";
    }
    
    return "pending";
  };

  const status = getRetoStatus();

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        🎲 Retos
      </h2>

      {retoActual ? (
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <div className="text-center mb-4">
            <p className="text-sm text-gray-600 mb-2">
              Reto del {new Date(retoActual.date).toLocaleDateString("es-CO")}
            </p>
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              {retoActual.description || retoActual.descripcion}
            </h3>
          </div>

          <div className="space-y-3 mb-4">
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <span>Persona 1</span>
              {retoActual.completed_user1 ? (
                <span className="text-green-600 font-bold">✓ Completado</span>
              ) : (
                <span className="text-gray-500">Pendiente</span>
              )}
            </div>
            <div className="flex items-center justify-between p-3 bg-pink-50 rounded-lg">
              <span>Persona 2</span>
              {retoActual.completed_user2 ? (
                <span className="text-green-600 font-bold">✓ Completado</span>
              ) : (
                <span className="text-gray-500">Pendiente</span>
              )}
            </div>
          </div>

          {status === "pending" && (
            <button
              onClick={handleCompleteReto}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200"
            >
              Marcar como Completado
            </button>
          )}

          {status === "waiting_partner" && (
            <div className="text-center p-4 bg-yellow-50 rounded-xl">
              <p className="text-gray-700">
                Esperando que tu pareja complete el reto
              </p>
            </div>
          )}

          {status === "completed" && (
            <div className="text-center p-4 bg-green-50 rounded-xl">
              <p className="text-green-700 font-bold">
                ¡Reto completado por ambos! 🎉
              </p>
            </div>
          )}

          {penitencia && (
            <div className="mt-4 p-4 bg-red-50 rounded-xl border-2 border-red-300">
              <p className="text-red-700 font-bold mb-2">⚠️ Penitencia:</p>
              <p className="text-red-600">{penitencia}</p>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-xl p-6 text-center">
          <p className="text-gray-600">
            No hay retos activos en este momento. Los retos aparecen el día 1 y
            15 de cada mes.
          </p>
        </div>
      )}

      {/* Historial de retos */}
      {retos.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">
            Historial de Retos
          </h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {retos.slice(0, 5).map((reto) => (
              <div
                key={reto.id}
                className="bg-white rounded-lg p-3 shadow-md"
              >
                <p className="text-sm text-gray-600 mb-1">
                  {new Date(reto.date).toLocaleDateString("es-CO")}
                </p>
                <p className="text-sm font-medium text-gray-800">
                  {reto.description}
                </p>
                <div className="flex items-center space-x-2 mt-2">
                  <span
                    className={`text-xs ${
                      reto.completed_user1 ? "text-green-600" : "text-gray-400"
                    }`}
                  >
                    P1: {reto.completed_user1 ? "✓" : "○"}
                  </span>
                  <span
                    className={`text-xs ${
                      reto.completed_user2 ? "text-green-600" : "text-gray-400"
                    }`}
                  >
                    P2: {reto.completed_user2 ? "✓" : "○"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
