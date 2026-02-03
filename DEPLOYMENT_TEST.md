# Prueba de Despliegue - Ahorro 2026

## Checklist de Verificación

### ✅ Frontend (Next.js 15)
- [x] Estructura de carpetas correcta
- [x] Componentes creados y funcionando
- [x] TypeScript configurado
- [x] Tailwind CSS configurado
- [x] Rutas configuradas (Home, Dashboard)
- [x] useSearchParams envuelto en Suspense (Next.js 15)
- [x] Imports correctos
- [x] Sin errores de linting

### ✅ Backend (FastAPI)
- [x] Estructura de API REST completa
- [x] Modelos de base de datos definidos
- [x] Endpoints implementados
- [x] CORS configurado
- [x] Endpoint de inicialización

### ✅ Componentes Frontend
- [x] Termometro - Animación dinámica
- [x] Estadisticas - Vista de estadísticas
- [x] Montos - Selección de montos
- [x] Objetivos - Lista de objetivos
- [x] Retos - Sistema de retos

### ✅ Datos
- [x] Archivo retos.json creado
- [x] Configuración de API URL

## Pasos para Probar el Despliegue

### 1. Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

Verificar que el servidor inicie en `http://localhost:8000`

### 2. Frontend
```bash
npm install
npm run dev
```

Verificar que el servidor inicie en `http://localhost:3000`

### 3. Pruebas Funcionales

1. **Home Page**
   - Abrir `http://localhost:3000`
   - Verificar que aparezcan los dos botones (Persona 1 y Persona 2)
   - Verificar que se inicialice la base de datos

2. **Dashboard Persona 1**
   - Click en "Persona 1"
   - Verificar que el dashboard tenga fondo azul
   - Verificar que aparezca el termómetro
   - Verificar los 4 botones principales

3. **Dashboard Persona 2**
   - Volver a home
   - Click en "Persona 2"
   - Verificar que el dashboard tenga fondo rosa

4. **Estadísticas**
   - Click en "Estadísticas"
   - Verificar que se muestren los datos (pueden estar en 0 inicialmente)

5. **Montos**
   - Click en "Montos"
   - Seleccionar un monto
   - Verificar que se registre y se coloree según el perfil

6. **Objetivos**
   - Click en "Objetivos"
   - Verificar que aparezcan los 7 objetivos

7. **Retos**
   - Click en "Retos"
   - Verificar que funcione (solo aparecerá si es día 1 o 15)

## Problemas Conocidos y Soluciones

### Problema: Error con pydantic-core (Rust)
**Solución**: Ver `backend/INSTALL_TROUBLESHOOTING.md`

### Problema: useSearchParams en Next.js 15
**Solución**: Ya corregido - envuelto en Suspense

### Problema: CORS en desarrollo
**Solución**: Backend ya tiene CORS configurado para permitir todos los orígenes

## Notas para Producción

1. **Variables de Entorno**: Configurar `NEXT_PUBLIC_API_URL` en Vercel
2. **Backend**: Desplegar en un servicio como Railway, Render, o Heroku contraseña supabase: oktsdDcKAfAht97J
3. **Base de Datos**: Considerar migrar de SQLite a PostgreSQL en producción
4. **CORS**: Restringir orígenes permitidos en producción
