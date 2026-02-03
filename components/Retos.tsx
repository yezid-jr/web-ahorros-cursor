"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { addSeconds, differenceInSeconds } from "date-fns";
import RetosIcon from "@/public/calendar-clock.svg";
import TimeIcon from "@/public/timee-icon.svg";

import API_URL from "@/lib/api";

interface Reto {
  id: number;
  description: string;
  tipo: string;
  date: string | null;
  completed_user1: boolean;
  completed_user2: boolean;
  penitencia_applied: boolean;
}

interface ProximoRetoInfo {
  next_activation_date: string;
  activation_type: string;
  retos_disponibles: number;
  automatic_activation: boolean;
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
  const [proximoRetoInfo, setProximoRetoInfo] = useState<ProximoRetoInfo | null>(null);
  const [nextRetoCountdown, setNextRetoCountdown] = useState<number>(0);

  useEffect(() => {
    fetchRetos();
    checkRetoActual();
    fetchRetosDisponibles();
    fetchProximoRetoInfo();
    fetchUsers();

    // Actualizar cada minuto
    const interval = setInterval(() => {
      fetchRetos();
      checkRetoActual();
      fetchProximoRetoInfo();
    }, 60000);

    return () => clearInterval(interval);
  }, []);
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


  // Countdown para el próximo reto automático
  useEffect(() => {
    if (!proximoRetoInfo) return;

    const calcularCountdown = () => {
      const proximaFecha = new Date(proximoRetoInfo.next_activation_date);
      const ahora = new Date();
      const diferencia = differenceInSeconds(proximaFecha, ahora);
      setNextRetoCountdown(Math.max(0, diferencia));
    };

    calcularCountdown();
    const timer = setInterval(calcularCountdown, 1000);
    return () => clearInterval(timer);
  }, [proximoRetoInfo]);

  // Countdown del reto actual (24 horas)
  useEffect(() => {
    if (!retoActual || !retoActual.date) return;

    const calcularTiempo = () => {
      const tiempoLimite = addSeconds(new Date(retoActual.date!), 86400); // 24 horas
      const ahora = new Date();
      const diferencia = differenceInSeconds(tiempoLimite, ahora);

      if (diferencia <= 0) {
        setTimeRemaining(0);

        if ((!retoActual.completed_user1 || !retoActual.completed_user2) &&
          !penitencia &&
          !retoActual.penitencia_applied) {
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

  const fetchProximoRetoInfo = async () => {
    try {
      const response = await axios.get(`${API_URL}/retos/proximo`);
      setProximoRetoInfo(response.data);
    } catch (error) {
      console.error("Error fetching próximo reto info:", error);
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

  const formatearCountdownLargo = (segundos: number) => {
    const dias = Math.floor(segundos / 86400);
    const horas = Math.floor((segundos % 86400) / 3600);
    const minutos = Math.floor((segundos % 3600) / 60);
    const secs = segundos % 60;

    if (dias > 0) {
      return `${dias}d ${horas}h ${minutos}m ${secs}s`;
    } else if (horas > 0) {
      return `${horas}h ${minutos}m ${secs}s`;
    } else if (minutos > 0) {
      return `${minutos}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  };

  const getProximaFechaReto = () => {
    if (!proximoRetoInfo) return "Calculando...";

    const fecha = new Date(proximoRetoInfo.next_activation_date);
    return fecha.toLocaleDateString("es-CO", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  // Filtrar historial
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
        <div className="flex items-center gap-2">
          <span className="text-xs px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full">
            🤖 Automático
          </span>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {retosDisponibles} en pool
          </div>
        </div>
      </div>

      {/* Botón manual (solo para pruebas) */}
      {/* {!retoActual && (
        <button
          onClick={activarRetoDePrueba}
          disabled={retosDisponibles === 0}
          className={`w-full mb-4 font-semibold py-3 px-6 rounded-xl transition-all duration-200 ${retosDisponibles === 0
              ? "bg-gray-400 dark:bg-gray-600 text-gray-600 dark:text-gray-300 cursor-not-allowed"
              : "bg-purple-500 hover:bg-purple-600 dark:bg-purple-600 dark:hover:bg-purple-700 text-white"
            }`}
        >
          {retosDisponibles === 0 ? "" : "🎲 Activar Reto (Manual)"}
        </button>
      )} */}

      {retoActual ? (
        // ============ RETO ACTIVO ============
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-6">
          <div className="text-center mb-4">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Reto del {new Date(retoActual.date!).toLocaleDateString("es-CO", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit"
              })}
            </p>

            {retoActual.tipo && (
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-3 ${retoActual.tipo === "ahorro"
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
              className={`mb-4 p-3 rounded-lg ${timeRemaining <= 0
                ? "bg-red-100 dark:bg-red-900/30"
                : "bg-blue-100 dark:bg-blue-900/30"
                }`}
            >
              <p
                className={`text-sm font-semibold ${timeRemaining <= 0
                  ? "text-red-600 dark:text-red-300"
                  : "text-blue-600 dark:text-blue-300"
                  }`}
              >
                {timeRemaining <= 0 ? "⏰ Tiempo agotado" : "⏱️ Tiempo restante"}
              </p>
              <p
                className={`text-2xl font-bold ${timeRemaining <= 0
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
              className={`w-full font-semibold py-3 px-6 rounded-xl transition-all duration-200 ${timeRemaining <= 0 || isSubmitting
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
        // ============ COUNTDOWN PRÓXIMO RETO ============
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 text-center mb-6">
          <div className="mb-4">
            <div className="inline-flex items-center justify-center w-18 h-18 ">
              <RetosIcon
                className="transition-colors duration-300"
                style={{
                  width: "32px",
                  height: "32px",
                  fill: isDark ? "#d8b4fe" : "#7c3aed",   // purple-300 / purple-600
                  stroke: isDark ? "#d8b4fe" : "#7c3aed",
                }}
              />
            </div>


            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
              Próximo Reto
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              {getProximaFechaReto()}
            </p>
          </div>

          <div className="bg-gradient-to-r from-purple-100 via-pink-100 to-blue-100 dark:from-purple-900/30 dark:via-pink-900/30 dark:to-blue-900/30 rounded-xl p-6 mb-4">
            <div className="flex justify-center gap-1">
              <TimeIcon
                className="transition-colors duration-300"
                style={{
                  width: "18px",
                  height: "18px",
                  fill: isDark ? "#d8b4fe" : "#7c3aed",   // purple-300 / purple-600
                  stroke: isDark ? "#d8b4fe" : "#7c3aed",
                }}
              />
            <p className="text-sm font-semibold text-purple-700 dark:text-purple-300 mb-2">
              Tiempo restante
            </p>

            </div>
            <p className="text-3xl font-bold text-purple-900 dark:text-purple-100 mb-2">
              {formatearCountdownLargo(nextRetoCountdown)}
            </p>
            {proximoRetoInfo && (
              <div className="mt-3 pt-3 border-t border-purple-200 dark:border-purple-700">
                <p className="text-xs text-purple-600 dark:text-purple-400">
                  {proximoRetoInfo.retos_disponibles} retos disponibles en el pool
                </p>
              </div>
            )}
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
            <p className="text-xs text-gray-500 dark:text-gray-500">
              Los retos se activan automáticamente el día <strong>1</strong> y <strong>15</strong> de cada mes a las 12:01 AM.
            </p>
          </div>
        </div>
      )}

      {/* ============ HISTORIAL DE RETOS ============ */}
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
                    {reto.date && new Date(reto.date).toLocaleDateString("es-CO")}
                  </p>
                  {reto.tipo && (
                    <span className={`text-xs px-2 py-0.5 rounded-full ${reto.tipo === "ahorro"
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
                    className={`text-xs ${reto.completed_user1
                      ? "text-green-600 dark:text-green-400"
                      : "text-gray-400"
                      }`}
                  >
                    {user1?.name || "P1"}: {reto.completed_user1 ? "✓" : "○"}
                  </span>
                  <span
                    className={`text-xs ${reto.completed_user2
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