# Despliegue en Vercel (Frontend) + Backend Separado

## Opción 1: Vercel para Frontend + Railway para Backend (Recomendado)

### Ventajas:
- ✅ Vercel es excelente para Next.js
- ✅ Railway maneja bien el backend Python
- ✅ Costo optimizado
- ✅ Mejor rendimiento

### Pasos:

#### 1. Desplegar Backend en Railway
```bash
# Solo la carpeta backend
cd backend
# Crear repositorio separado o usar Railway con GitHub
```

#### 2. Configurar Frontend para Vercel
Actualizar variables de entorno en Vercel:
```
NEXT_PUBLIC_API_URL=https://tu-backend.railway.app
```

#### 3. Desplegar Frontend en Vercel
```bash
# Desde raíz del proyecto
npm install -g vercel
vercel --prod
```

---

## Opción 2: Todo en Vercel (Limitaciones)

### Limitaciones de Vercel para Backend:
- ❌ No soporta FastAPI directamente
- ❌ Límites de ejecución (10 segundos)
- ❌ Sin persistencia de datos local
- ❌ Sin SQLite en producción

### Solución: Convertir a Serverless Functions

#### 1. Crear API Routes en Next.js
```javascript
// pages/api/ahorros.js
export default async function handler(req, res) {
  // Lógica de backend aquí
  // Conectar a base de datos externa (PostgreSQL/MySQL)
}
```

#### 2. Migrar lógica de FastAPI a Next.js API Routes

---

## Opción 3: Vercel + Base de Datos Externa

### Usar Supabase o PlanetScale
```javascript
// Conexión a base de datos en la nube
const { createClient } = require('@supabase/supabase-js')
const supabase = createClient(URL, KEY)
```

---

## Recomendación Final

**Mejor Opción: Vercel + Railway**
```
Frontend (Next.js) → Vercel
Backend (FastAPI) → Railway  
Base de Datos → Railway (SQLite)
```

### Costos:
- Vercel: Gratis (hasta límites)
- Railway: Gratis → $20/mes
- Total: $0-20/mes

### Acceso Móvil:
- URL única en Vercel
- Backend invisible para el usuario
- Experiencia integrada

---

## Pasos para Implementar:

1. **Subir backend a Railway**
2. **Obtener URL del backend**
3. **Configurar variable en Vercel**
4. **Desplegar frontend en Vercel**
5. **Probar acceso móvil**

¿Quieres que te ayude a implementar la opción recomendada (Vercel + Railway)?
