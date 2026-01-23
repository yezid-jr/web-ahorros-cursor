# Backend - Ahorro 2026 API

API REST construida con FastAPI para gestionar ahorros en pareja.

## Instalación

```bash
pip install -r requirements.txt
```

## Ejecución

```bash
uvicorn main:app --reload
```

La API estará disponible en `http://localhost:8000`

## Inicializar Base de Datos

Antes de usar la aplicación, ejecuta:

```bash
curl http://localhost:8000/init
```

O visita `http://localhost:8000/init` en tu navegador.

## Endpoints

- `GET /` - Información de la API
- `POST /init` - Inicializar base de datos
- `GET /users` - Listar usuarios
- `GET /users/{user_id}` - Obtener usuario
- `POST /users` - Crear usuario
- `GET /montos` - Listar montos
- `POST /montos` - Crear monto
- `PUT /montos/{monto_id}/select` - Seleccionar monto
- `GET /ahorros` - Listar ahorros
- `POST /ahorros` - Crear ahorro
- `GET /estadisticas` - Obtener estadísticas
- `GET /objetivos` - Listar objetivos
- `GET /retos` - Listar retos
- `GET /retos/actual` - Obtener reto actual
- `POST /retos/crear` - Crear reto
- `POST /retos/{reto_id}/complete` - Completar reto
