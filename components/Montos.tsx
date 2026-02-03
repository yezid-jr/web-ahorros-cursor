"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import API_URL from "@/lib/api";

interface Monto {
  id: number;
  amount: number;
  user_id: number;
  selected: boolean;
}

const MONTOS_DISPONIBLES = [
  4000, 10000, 22000, 50000, 100000, 200000, 500000, 1000000,
];

export default function Montos({ userId }: { userId: number }) {
  const [montos, setMontos] = useState<Monto[]>([]);
  const [selectedMonto, setSelectedMonto] = useState<number | null>(null);

  useEffect(() => {
    fetchMontos();
  }, []);

  const fetchMontos = async () => {
    try {
      const response = await axios.get(`${API_URL}/montos`);
      setMontos(response.data);
    } catch (error) {
      console.error("Error fetching montos:", error);
    }
  };

  const handleSelectMonto = async (montoId: number) => {
    try {
      await axios.put(
        `${API_URL}/montos/${montoId}/select?user_id=${userId}`
      );

      const monto = montos.find((m) => m.id === montoId);

      if (monto) {
        await axios.post(`${API_URL}/ahorros`, {
          user_id: userId,
          monto_id: montoId,
          amount: monto.amount,
        });
      }

      setSelectedMonto(montoId);
      setTimeout(() => {
        setSelectedMonto(null);
        fetchMontos();
      }, 2000);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleCreateAndSelectMonto = async (amount: number) => {
    try {
      const createResponse = await axios.post(`${API_URL}/montos`, {
        amount,
        user_id: userId,
      });

      const newMonto = createResponse.data;

      await axios.put(
        `${API_URL}/montos/${newMonto.id}/select?user_id=${userId}`
      );

      await axios.post(`${API_URL}/ahorros`, {
        user_id: userId,
        monto_id: newMonto.id,
        amount: newMonto.amount,
      });

      setSelectedMonto(newMonto.id);
      setTimeout(() => {
        setSelectedMonto(null);
        fetchMontos();
      }, 2000);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const montosSeleccionados = montos.filter((m) => m.selected);

  const getMontoColor = (monto: Monto) => {
    if (monto.user_id === 1) return "bg-blue-500";
    if (monto.user_id === 2) return "bg-pink-500";
    return "bg-gray-500";
  };

  return (
    <div className="max-w-4xl mx-auto px-4">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 text-center">
        Montos
      </h2>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Montos seleccionados */}
        <div>
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3">
            Seleccionados
          </h3>

          {montosSeleccionados.length > 0 ? (
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {montosSeleccionados.map((monto) => (
                <div
                  key={monto.id}
                  className={`${getMontoColor(
                    monto
                  )} text-white rounded-lg px-4 py-3 min-w-[140px] text-center shadow`}
                >
                  <p className="text-lg font-semibold">
                    ${monto.amount.toLocaleString("es-CO")}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No hay montos seleccionados
            </p>
          )}
        </div>

        {/* Montos disponibles */}
        <div>
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3">
            Montos
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {MONTOS_DISPONIBLES.map((amount) => (
              <button
                key={amount}
                onClick={() => handleCreateAndSelectMonto(amount)}
                className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 rounded-lg px-3 py-3 text-center transition-all duration-200 hover:scale-[1.02] shadow-sm"
              >
                <p className="text-base font-semibold text-gray-800 dark:text-white">
                  ${amount.toLocaleString("es-CO")}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Modal confirmación */}
      {selectedMonto && (
        <div className="fixed top-6 right-6 z-50 animate-slide-in">
          <div className="flex items-center gap-3 bg-white dark:bg-gray-900 border border-green-200 dark:border-green-800 rounded-xl px-5 py-3 shadow-lg">
            <span className="text-green-600 text-xl">✓</span>
            <div>
              <p className="text-sm font-semibold text-gray-800 dark:text-white">
                Monto registrado
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Ahorro agregado correctamente
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
