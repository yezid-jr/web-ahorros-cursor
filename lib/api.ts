// Asegurar que la URL no tenga barra final
const getApiUrl = () => {
  const url = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  return url.endsWith('/') ? url.slice(0, -1) : url;
};

const API_URL = getApiUrl();

export default API_URL;
