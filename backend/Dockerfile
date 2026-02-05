FROM python:3.11-slim

WORKDIR /app

# Copiar requirements primero para caché
COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

# Copiar código fuente
COPY . .

# Exponer puerto (Railway asignará uno dinámicamente)
EXPOSE 8000

# Comando para ejecutar la aplicación usando PORT de Railway o 8000 por defecto
CMD uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}
