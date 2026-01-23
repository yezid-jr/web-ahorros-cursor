# Guía de Prueba de Despliegue

## Estado del Proyecto

✅ **Frontend**: Configurado y listo
✅ **Backend**: Configurado y listo
✅ **Correcciones aplicadas**:
  - useSearchParams envuelto en Suspense (Next.js 15)
  - Endpoint de retos corregido para aceptar query parameters

## Comandos para Probar

### Terminal 1 - Backend
```powershell
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

**Verificar**: Debe iniciar en `http://localhost:8000`
**Probar**: Abrir `http://localhost:8000/docs` para ver la documentación de la API

### Terminal 2 - Frontend
```powershell
npm install
npm run dev
```

**Verificar**: Debe iniciar en `http://localhost:3000`

## Flujo de Prueba

1. **Inicialización**
   - Abrir `http://localhost:3000`
   - La página Home debe aparecer con 2 botones
   - La base de datos se inicializa automáticamente

2. **Dashboard Persona 1**
   - Click en "Persona 1"
   - URL debe ser: `http://localhost:3000/dashboard?user=1`
   - Fondo debe ser azul
   - Termómetro debe aparecer (puede mostrar 0% inicialmente)
   - 4 botones deben estar visibles

3. **Navegación**
   - Click en "Estadísticas" → Debe mostrar estadísticas
   - Click en "Volver" → Debe regresar al dashboard
   - Click en "Montos" → Debe mostrar lista de montos
   - Seleccionar un monto → Debe registrarse y colorearse
   - Click en "Objetivos" → Debe mostrar 7 objetivos
   - Click en "Retos" → Debe mostrar retos (solo si es día 1 o 15)

4. **Dashboard Persona 2**
   - Volver a home (`/`)
   - Click en "Persona 2"
   - Fondo debe ser rosa
   - Funcionalidad igual que Persona 1

## Verificaciones de API

### Endpoints a probar manualmente:
1. `GET http://localhost:8000/` - Debe responder con mensaje
2. `POST http://localhost:8000/init` - Debe inicializar DB
3. `GET http://localhost:8000/users` - Debe listar usuarios
4. `GET http://localhost:8000/estadisticas` - Debe retornar estadísticas
5. `GET http://localhost:8000/objetivos` - Debe listar objetivos
6. `GET http://localhost:8000/montos` - Debe listar montos
7. `GET http://localhost:8000/retos` - Debe listar retos

## Posibles Errores y Soluciones

### Error: "Cannot find module"
**Solución**: Ejecutar `npm install` nuevamente

### Error: "Failed to fetch" en el frontend
**Solución**: Verificar que el backend esté corriendo en puerto 8000

### Error: "useSearchParams() should be wrapped in a suspense boundary"
**Solución**: Ya corregido - el componente está envuelto en Suspense

### Error: Base de datos no inicializada
**Solución**: El frontend intenta inicializar automáticamente, pero puedes hacerlo manualmente:
```bash
curl http://localhost:8000/init
```

## Checklist Final

- [ ] Backend inicia sin errores
- [ ] Frontend inicia sin errores
- [ ] Home page carga correctamente
- [ ] Dashboard Persona 1 funciona
- [ ] Dashboard Persona 2 funciona
- [ ] Todas las vistas cargan (Estadísticas, Montos, Objetivos, Retos)
- [ ] Los montos se pueden seleccionar
- [ ] El termómetro se actualiza
- [ ] No hay errores en la consola del navegador
- [ ] No hay errores en la consola del backend

## Notas para Producción

1. Configurar `NEXT_PUBLIC_API_URL` en Vercel
2. Desplegar backend en servicio cloud (Railway, Render, etc.)
3. Considerar migrar a PostgreSQL para producción
4. Configurar CORS para dominio específico en producción
