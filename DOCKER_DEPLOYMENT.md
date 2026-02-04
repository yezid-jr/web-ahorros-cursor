# Despliegue con Docker

## Requisitos Previos
- Docker y Docker Compose instalados
- Git clonado en tu máquina local

## Pasos para Despliegue

### 1. Construir y Levantar Contenedores
```bash
# En la raíz del proyecto
docker-compose up --build
```

### 2. Acceder a la Aplicación
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- Documentación API: http://localhost:8000/docs

### 3. Comandos Útiles

#### Levantar en segundo plano
```bash
docker-compose up -d
```

#### Ver logs
```bash
docker-compose logs -f
```

#### Detener servicios
```bash
docker-compose down
```

#### Reconstruir después de cambios
```bash
docker-compose up --build --force-recreate
```

### 4. Variables de Entorno

Para producción, crea un archivo `.env`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
DATABASE_URL=sqlite:///./ahorro.db
```

### 5. Persistencia de Datos

- La base de datos SQLite se guarda en un volumen Docker
- Los datos persisten aunque los contenedores se reinicien

### 6. Solución de Problemas

#### Si el frontend no conecta con el backend:
1. Verifica que ambos servicios estén corriendo: `docker-compose ps`
2. Revisa los logs: `docker-compose logs frontend`
3. Asegúrate que el puerto 8000 esté disponible

#### Si hay problemas de permisos:
```bash
docker-compose down
docker-compose up --build
```

### 7. Despliegue en Producción

Para producción, modifica `docker-compose.yml`:
- Cambia `localhost:8000` por la URL del servidor
- Considera usar nginx como reverse proxy
- Configura HTTPS con certificados SSL
