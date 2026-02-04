"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import axios from "axios";
import API_URL from "@/lib/api";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Inicializar base de datos al cargar
    const initDB = async () => {
      try {
        await axios.post(`${API_URL}/init`);
      } catch (error) {
        console.error("Error initializing DB:", error);
      }
    };
    initDB();
  }, []);

  const handleLogin = (userId: number) => {
    localStorage.setItem("userId", userId.toString());
    router.push(`/dashboard?user=${userId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-pink-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Ahorro 2026
        </h1>
        <p className="text-gray-600 mb-8 text-lg">
          Juntos hacia nuestros objetivos
        </p>
        <div className="space-y-4">
          <button
            onClick={() => handleLogin(1)}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            Persona 1
          </button>
          <button
            onClick={() => handleLogin(2)}
            className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            Persona 2
          </button>
        </div>
      </div>
    </div>
  );
}
