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
    
    await axios.put(`${API_URL}/montos/${montoId}/select?user_id=${userId}`);
    
    const monto = montos.find((m) => m.id === montoId);
    
    if (monto) {
      const ahorroData = {
        user_id: userId,
        monto_id: montoId,
        amount: monto.amount,
      };
      
      const response = await axios.post(`${API_URL}/ahorros`, ahorroData);
      console.log("Respuesta del servidor:", response.data);
    } else {
      console.error("ERROR: No se encontró el monto");
    }

    setSelectedMonto(montoId);
    setTimeout(() => {
      setSelectedMonto(null);
      fetchMontos();
    }, 2000);
  } catch (error) {
    console.error("Error:", error);
    if (axios.isAxiosError(error)) {
      console.error("Response data:", error.response?.data);
      console.error("Status:", error.response?.status);
    }
  }
};

  const handleCreateAndSelectMonto = async (amount: number) => {
  try {
    
    // Crear monto
    const createResponse = await axios.post(`${API_URL}/montos`, {
      amount,
      user_id: userId,
    });
    
    const newMonto = createResponse.data;
    
    // Marcar como seleccionado
    await axios.put(`${API_URL}/montos/${newMonto.id}/select?user_id=${userId}`);
    
    // Crear ahorro directamente con los datos del monto recién creado
    const ahorroData = {
      user_id: userId,
      monto_id: newMonto.id,
      amount: newMonto.amount,
    };
    
    const ahorroResponse = await axios.post(`${API_URL}/ahorros`, ahorroData);
    console.log("Ahorro creado:", ahorroResponse.data);
    
    // Mostrar confirmación
    setSelectedMonto(newMonto.id);
    setTimeout(() => {
      setSelectedMonto(null);
      fetchMontos();
    }, 2000);
    
  } catch (error) {
    console.error("Error:", error);
    if (axios.isAxiosError(error)) {
      console.error("Response data:", error.response?.data);
      console.error("Status:", error.response?.status);
    }
  }
};

  // Agrupar montos por selección
  const montosSeleccionados = montos.filter((m) => m.selected);
  // Montos disponibles son los que no han sido seleccionados aún
  const montosDisponibles = MONTOS_DISPONIBLES;

  const getMontoColor = (monto: Monto) => {
    if (monto.user_id === 1) return "bg-blue-500";
    if (monto.user_id === 2) return "bg-pink-500";
    return "bg-gray-500";
  };

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        💵 Montos
      </h2>

      {/* Montos seleccionados */}
      {montosSeleccionados.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">
            Montos Seleccionados
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {montosSeleccionados.map((monto) => (
              <div
                key={monto.id}
                className={`${getMontoColor(monto)} text-white rounded-xl p-4 text-center shadow-lg`}
              >
                <p className="text-2xl font-bold">
                  ${monto.amount.toLocaleString("es-CO")}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Montos disponibles */}
      <div>
        <h3 className="text-lg font-semibold text-gray-700 mb-3">
          Seleccionar Monto
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {montosDisponibles.map((amount) => (
            <button
              key={amount}
              onClick={() => handleCreateAndSelectMonto(amount)}
              className="bg-white border-2 border-gray-300 hover:border-blue-500 rounded-xl p-4 text-center transition-all duration-200 transform hover:scale-105 shadow-md"
            >
              <p className="text-xl font-bold text-gray-800">
                ${amount.toLocaleString("es-CO")}
              </p>
            </button>
          ))}
        </div>
      </div>

      {selectedMonto && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 text-center">
            <p className="text-2xl font-bold text-green-600 mb-2">✓</p>
            <p className="text-lg text-gray-800">Monto registrado exitosamente</p>
          </div>
        </div>
      )}
    </div>
  );
}
