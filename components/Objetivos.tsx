"use client";

import { useEffect, useState } from "react";
import axios from "axios";

import API_URL from "@/lib/api";

interface Objetivo {
  id: number;
  amount: number;
  completed: boolean;
  completed_at: string | null;
}

export default function Objetivos({ userId }: { userId: number }) {
  const [objetivos, setObjetivos] = useState<Objetivo[]>([]);

  useEffect(() => {
    fetchObjetivos();
    const interval = setInterval(fetchObjetivos, 3000);
    return () => clearInterval(interval);
  }, []);

  const fetchObjetivos = async () => {
    try {
      const response = await axios.get(`${API_URL}/objetivos`);
      setObjetivos(response.data);
    } catch (error) {
      console.error("Error fetching objetivos:", error);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        🎯 Objetivos
      </h2>

      <div className="space-y-4">
        {objetivos.map((objetivo) => (
          <div
            key={objetivo.id}
            className={`p-4 rounded-xl border-2 ${
              objetivo.completed
                ? "bg-green-50 border-green-500"
                : "bg-gray-50 border-gray-300"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {objetivo.completed ? (
                  <span className="text-2xl">✓</span>
                ) : (
                  <span className="text-2xl">○</span>
                )}
                <p
                  className={`text-xl font-bold ${
                    objetivo.completed
                      ? "line-through text-gray-500"
                      : "text-gray-800"
                  }`}
                >
                  ${objetivo.amount.toLocaleString("es-CO")}
                </p>
              </div>
              {objetivo.completed && objetivo.completed_at && (
                <span className="text-xs text-gray-500">
                  {new Date(objetivo.completed_at).toLocaleDateString("es-CO")}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-xl">
        <p className="text-sm text-gray-600 text-center">
          💡 Los objetivos se marcan automáticamente cuando se alcanzan
        </p>
      </div>
    </div>
  );
}
