# Ahorro 2026 - App de Ahorro en Pareja

Aplicación web para gestionar ahorros en pareja con objetivos, retos y seguimiento de progreso.

## Estructura del Proyecto

- `frontend/` - Aplicación Next.js 15 con TypeScript y Tailwind
- `backend/` - API REST con FastAPI

## Instalación

### Frontend
```bash
npm install
npm run dev
```

### Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

### Docker

Primero se debe tener Docker Desktop instalado en la máquina y ejecutarse el comando:

```bash
docker-compose up --build
```

## Despliegue

El despliegue se realizó en Railway.

1. Ir a Railway
 Ve a railway.app
Login con GitHub
2. Nuevo Proyecto
"New Project" → "Deploy from GitHub repo"
Selecciona yezid-jr/web-ahorros-cursor
3. Variables de Entorno
En Settings → Variables:

NEXT_PUBLIC_API_URL=https://tu-app.railway.app
DATABASE_URL=sqlite:///./ahorro.db
PORT=8000
4. Despliegue Automático
Railway construirá las imágenes Docker
Desplegará frontend y backend
Te dará URL pública

<!-- El frontend está configurado para desplegarse en Vercel. -->
