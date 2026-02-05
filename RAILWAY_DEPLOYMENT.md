# Despliegue en Railway (Nube)

## Pasos para Despliegue

### 1. Preparar Repositorio GitHub

```bash
# Si no tienes Git inicializado
git init
git add .
git commit -m ""

# Conectar con GitHub (reemplaza con tu repo)
git remote add origin https://github.com/tu-usuario/web-ahorros-cursor-main.git
git push -u origin main
```

### 2. Configurar Railway

1. **Crear cuenta en Railway**
   - Ve a [railway.app](https://railway.app)
   - Regístrate con GitHub

2. **Nuevo Proyecto**
   - Click "New Project" → "Deploy from GitHub repo"
   - Selecciona tu repositorio

3. **Configurar Variables de Entorno**
   ```
   NEXT_PUBLIC_API_URL=https://tu-app.railway.app/backend
   DATABASE_URL=sqlite:///./ahorro.db
   PORT=8000
   ```

4. **Configurar Dominio**
   - Railway asignará una URL como: `https://tu-app.railway.app`
   - Puedes configurar un dominio personalizado si quieres

### 3. Acceso desde Móvil

Una vez desplegado:
- **App Principal:** `https://tu-app.railway.app`
- **API:** `https://tu-app.railway.app/backend`
- **Documentación:** `https://tu-app.railway.app/backend/docs`

### 4. Monitoreo

- Railway muestra logs en tiempo real
- Métricas de uso y rendimiento
- Alertas automáticas

### 5. Alternativas a Railway

**Render.com**
- Similar a Railway
- $7/mes para producción
- Soporte Docker

**DigitalOcean App Platform**
- Más robusto
- $5/mes básico
- Escalable

**VPS + Docker**
- Total control
- $5-10/mes
- Requiere más configuración

## Costos Estimados

- **Railway:** Gratis (límites) → $20/mes (producción)
- **Render:** Gratis → $7/mes
- **VPS:** $5/mes (DigitalOcean/Vultr)

## Recomendación

**Empieza con Railway** - es gratis para probar y muy fácil de usar.
