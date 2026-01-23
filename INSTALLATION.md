# Guía de Instalación - Ahorro 2026

## Requisitos Previos

- Node.js 18+ y npm
- Python 3.8+
- pip (gestor de paquetes de Python)

## Instalación del Frontend

1. Instala las dependencias:
```bash
npm install
```

2. Crea un archivo `.env.local` en la raíz del proyecto:
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

3. Ejecuta el servidor de desarrollo:
```bash
npm run dev
```

El frontend estará disponible en `http://localhost:3000`

## Instalación del Backend

1. Navega a la carpeta backend:
```bash
cd backend
```

2. Crea un entorno virtual (recomendado):
```bash
python -m venv venv
```

3. Activa el entorno virtual:
- Windows:
```bash
venv\Scripts\activate
```
- Linux/Mac:
```bash
source venv/bin/activate
```

4. Instala las dependencias:
```bash
pip install -r requirements.txt
```

5. Ejecuta el servidor:
```bash
uvicorn main:app --reload
```

O usa los scripts proporcionados:
- Windows: `run.bat`
- Linux/Mac: `bash run.sh`

El backend estará disponible en `http://localhost:8000`

6. Inicializa la base de datos visitando:
```
http://localhost:8000/init
```

O ejecuta:
```bash
curl http://localhost:8000/init
```

## Despliegue en Vercel

1. Conecta tu repositorio a Vercel
2. Configura las variables de entorno:
   - `NEXT_PUBLIC_API_URL`: URL de tu API backend desplegada
3. Vercel detectará automáticamente Next.js y desplegará el frontend

## Notas Importantes

- El backend debe estar corriendo antes de usar el frontend
- La base de datos SQLite se crea automáticamente en `backend/ahorro.db`
- Los usuarios se crean automáticamente al inicializar la base de datos
- Los objetivos se crean automáticamente al inicializar la base de datos
