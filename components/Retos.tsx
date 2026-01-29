"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { isAfter, addSeconds, differenceInSeconds } from "date-fns";

import API_URL from "@/lib/api";

interface Reto {
  id: number;
  description: string;
  date: string;
  completed_user1: boolean;
  completed_user2: boolean;
  penitencia_applied: boolean;
  tipo?: string;
}

export default function Retos({ userId }: { userId: number }) {
  const [retos, setRetos] = useState<Reto[]>([]);
  const [retoActual, setRetoActual] = useState<Reto | null>(null);
  const [penitencia, setPenitencia] = useState<string | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [retosDisponibles, setRetosDisponibles] = useState<number>(0);
  const [user1, setUser1] = useState<any>(null);
  const [user2, setUser2] = useState<any>(null);

  useEffect(() => {
    fetchRetos();
    checkRetoActual();
    fetchRetosDisponibles();
    fetchUsers();
    
    const interval = setInterval(() => {
      fetchRetos();
      checkRetoActual();
    }, 60000);
    
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!retoActual || !retoActual.date) return;

    const calcularTiempo = () => {
      const tiempoLimite = addSeconds(new Date(retoActual.date), 85000); // 24 horas = 86400 segundos
      const ahora = new Date();
      const diferencia = differenceInSeconds(tiempoLimite, ahora);

      if (diferencia <= 0) {
        setTimeRemaining(0);
        
        if ((!retoActual.completed_user1 || !retoActual.completed_user2) && !penitencia && !retoActual.penitencia_applied) {
          fetchPenitenciaAleatoria();
          aplicarPenitencia(retoActual.id);
        }
      } else {
        setTimeRemaining(diferencia);
      }
    };

    calcularTiempo();
    const timer = setInterval(calcularTiempo, 1000);
    return () => clearInterval(timer);
  }, [retoActual, penitencia]);

  const fetchRetos = async () => {
    try {
      const response = await axios.get(`${API_URL}/retos`);
      setRetos(response.data);
    } catch (error) {
      console.error("Error fetching retos:", error);
    }
  };

  const fetchRetosDisponibles = async () => {
    try {
      const response = await axios.get(`${API_URL}/retos/disponibles`);
      setRetosDisponibles(response.data.total);
    } catch (error) {
      console.error("Error fetching retos disponibles:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const user1Response = await axios.get(`${API_URL}/users/1`);
      const user2Response = await axios.get(`${API_URL}/users/2`);
      setUser1(user1Response.data);
      setUser2(user2Response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const checkRetoActual = async () => {
    try {
      const response = await axios.get(`${API_URL}/retos/actual`);
      
      if (response.data.reto) {
        setRetoActual(response.data.reto);
        
        if (response.data.reto.penitencia_applied && !penitencia) {
          fetchPenitenciaAleatoria();
        }
      } else {
        setRetoActual(null);
        setPenitencia(null);
      }
    } catch (error) {
      console.error("Error checking reto actual:", error);
    }
  };

  const fetchPenitenciaAleatoria = async () => {
    try {
      const response = await axios.get(`${API_URL}/penitencias/random`);
      setPenitencia(response.data.penitencia);
    } catch (error) {
      console.error("Error fetching penitencia:", error);
    }
  };

  const aplicarPenitencia = async (retoId: number) => {
    try {
      await axios.post(`${API_URL}/retos/${retoId}/aplicar-penitencia`);
    } catch (error) {
      console.error("Error aplicando penitencia:", error);
    }
  };

  const activarRetoDePrueba = async () => {
    try {
      const response = await axios.post(`${API_URL}/retos/activar`);
      
      if (response.data.message?.includes("Ya existe")) {
        alert("Ya existe un reto activo");
      } else {
        setRetoActual(response.data.reto);
        setPenitencia(null);
        fetchRetos();
        fetchRetosDisponibles();
      }
    } catch (error: any) {
      if (error.response?.status === 404) {
        alert("No hay más retos disponibles. Todos los retos han sido usados.");
      } else {
        console.error("Error activando reto:", error);
      }
    }
  };

  const handleCompleteReto = async () => {
    if (!retoActual || !retoActual.id) return;

    setIsSubmitting(true);
    try {
      const response = await axios.post(
        `${API_URL}/retos/${retoActual.id}/complete?user_id=${userId}`
      );
      
      setRetoActual(response.data.reto);
      
      if (response.data.ambos_completados) {
        setTimeout(() => {
          alert("¡Felicitaciones! Ambos completaron el reto 🎉");
        }, 500);
      }
      
      fetchRetos();
    } catch (error: any) {
      if (error.response?.status === 400) {
        alert(error.response.data.detail);
      } else {
        console.error("Error completing reto:", error);
      }
    } finally {
      setIsSubmitting(false);
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

  const formatearTiempo = (segundos: number) => {
    const horas = Math.floor(segundos / 3600);
    const minutos = Math.floor((segundos % 3600) / 60);
    const secs = segundos % 60;
    return `${horas.toString().padStart(2, "0")}:${minutos
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Filtrar historial: excluir el reto actual y retos sin fecha
  const retosHistorial = retos.filter(
    (reto) => reto.id !== retoActual?.id && reto.date !== null
  );

  const status = getRetoStatus();

  return (
    <div className="max-w-md mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          Retos
        </h2>
        <div className="text-xs text-gray-500 dark:text-gray-400">
          {retosDisponibles} disponibles
        </div>
      </div>

      {!retoActual && (
        <button
          onClick={activarRetoDePrueba}
          disabled={retosDisponibles === 0}
          className={`w-full mb-4 font-semibold py-3 px-6 rounded-xl transition-all duration-200 ${
            retosDisponibles === 0
              ? "bg-gray-400 text-gray-600 cursor-not-allowed"
              : "bg-purple-500 hover:bg-purple-600 text-white"
          }`}
        >
          {retosDisponibles === 0 ? "🎉 No hay más retos" : "🎲 Activar Reto Aleatorio"}
        </button>
      )}

      {retoActual ? (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-6">
          <div className="text-center mb-4">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Reto del {new Date(retoActual.date).toLocaleDateString("es-CO", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit"
              })}
            </p>
            
            {retoActual.tipo && (
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-3 ${
                retoActual.tipo === "ahorro"
                  ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                  : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
              }`}>
                {retoActual.tipo === "ahorro" ? "💰 Ahorro" : "🎁 Gratis"}
              </span>
            )}
            
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
              {retoActual.description}
            </h3>

            <div
              className={`mb-4 p-3 rounded-lg ${
                timeRemaining <= 0
                  ? "bg-red-100 dark:bg-red-900/30"
                  : "bg-blue-100 dark:bg-blue-900/30"
              }`}
            >
              <p
                className={`text-sm font-semibold ${
                  timeRemaining <= 0
                    ? "text-red-600 dark:text-red-300"
                    : "text-blue-600 dark:text-blue-300"
                }`}
              >
                {timeRemaining <= 0 ? "⏰ Tiempo agotado" : "⏱️ Tiempo restante"}
              </p>
              <p
                className={`text-2xl font-bold ${
                  timeRemaining <= 0
                    ? "text-red-700 dark:text-red-200"
                    : "text-blue-700 dark:text-blue-200"
                }`}
              >
                {formatearTiempo(timeRemaining)}
              </p>
            </div>
          </div>

          <div className="space-y-3 mb-4">
            <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
              <span className="text-gray-800 dark:text-gray-200">{user1?.name || "Persona 1"}</span>
              {retoActual.completed_user1 ? (
                <span className="text-green-600 dark:text-green-400 font-bold">
                  ✓ Completado
                </span>
              ) : (
                <span className="text-gray-500 dark:text-gray-400">Pendiente</span>
              )}
            </div>
            <div className="flex items-center justify-between p-3 bg-pink-50 dark:bg-pink-900/30 rounded-lg">
              <span className="text-gray-800 dark:text-gray-200">{user2?.name || "Persona 2"}</span>
              {retoActual.completed_user2 ? (
                <span className="text-green-600 dark:text-green-400 font-bold">
                  ✓ Completado
                </span>
              ) : (
                <span className="text-gray-500 dark:text-gray-400">Pendiente</span>
              )}
            </div>
          </div>

          {status === "pending" && (
            <button
              onClick={handleCompleteReto}
              disabled={timeRemaining <= 0 || isSubmitting}
              className={`w-full font-semibold py-3 px-6 rounded-xl transition-all duration-200 ${
                timeRemaining <= 0 || isSubmitting
                  ? "bg-gray-400 dark:bg-gray-600 text-gray-600 dark:text-gray-300 cursor-not-allowed"
                  : "bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white"
              }`}
            >
              {isSubmitting ? "Procesando..." : "Marcar como Completado"}
            </button>
          )}

          {status === "waiting_partner" && (
            <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/30 rounded-xl">
              <p className="text-gray-700 dark:text-yellow-200">
                ⏳ Esperando que tu pareja complete el reto
              </p>
            </div>
          )}

          {status === "completed" && (
            <div className="text-center p-4 bg-green-50 dark:bg-green-900/30 rounded-xl">
              <p className="text-green-700 dark:text-green-300 font-bold">
                ¡Reto completado por ambos! 🎉
              </p>
            </div>
          )}

          {timeRemaining <= 0 && (
            <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/30 rounded-xl border-2 border-red-300 dark:border-red-700">
              <p className="text-red-700 dark:text-red-300 font-bold mb-2">
                El tiempo se acabó :(
              </p>
              {(!retoActual.completed_user1 || !retoActual.completed_user2) && (
                <>
                  <p className="text-red-600 dark:text-red-200 mb-3">
                    El reto no fue completado por ambos. ¡Penitencia!
                  </p>
                  {penitencia && (
                    <div className="p-3 bg-red-100 dark:bg-red-800/50 rounded-lg border border-red-400 dark:border-red-600">
                      <p className="text-red-800 dark:text-red-100 font-bold">
                        ⚠️ {penitencia}
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            No hay retos activos en este momento.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500">
            Los retos normalmente aparecen el día 1 y 15 de cada mes.
            <br />
            Usa el botón de arriba para activar uno de prueba.
          </p>
        </div>
      )}

      {/* Historial de retos - FILTRADO */}
      {retosHistorial.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3">
            Historial de Retos ({retosHistorial.length})
          </h3>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {retosHistorial.map((reto) => (
              <div
                key={reto.id}
                className="bg-white dark:bg-gray-700 rounded-lg p-3 shadow-md"
              >
                <div className="flex justify-between items-start mb-1">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {new Date(reto.date).toLocaleDateString("es-CO")}
                  </p>
                  {reto.tipo && (
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      reto.tipo === "ahorro"
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                        : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                    }`}>
                      {reto.tipo === "ahorro" ? "💰" : "🎁"}
                    </span>
                  )}
                </div>
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">
                  {reto.description}
                </p>
                <div className="flex items-center space-x-4">
                  <span
                    className={`text-xs ${
                      reto.completed_user1
                        ? "text-green-600 dark:text-green-400"
                        : "text-gray-400"
                    }`}
                  >
                    {user1?.name || "P1"}: {reto.completed_user1 ? "✓" : "○"}
                  </span>
                  <span
                    className={`text-xs ${
                      reto.completed_user2
                        ? "text-green-600 dark:text-green-400"
                        : "text-gray-400"
                    }`}
                  >
                    {user2?.name || "P2"}: {reto.completed_user2 ? "✓" : "○"}
                  </span>
                  {reto.penitencia_applied && (
                    <span className="text-xs text-red-600 dark:text-red-400">
                      ⚠️ Penitencia
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}