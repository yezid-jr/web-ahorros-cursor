# Características - Ahorro 2026

## Funcionalidades Principales

### 🏠 Página Home
- Pantalla de inicio con dos botones para seleccionar perfil
- Cada persona tiene su propio dashboard con colores diferenciados
- Persona 1: Azul (#3B82F6)
- Persona 2: Rosa (#EC4899)

### 📊 Dashboard Principal
- Vista principal con animación de termómetro dinámico
- El termómetro muestra el progreso hacia el objetivo actual
- Cambia automáticamente de objetivo cuando se alcanza uno
- 4 botones principales para navegar a diferentes secciones

### 📈 Estadísticas
- **Total del Mes**: Suma de todos los ahorros del mes actual
- **Faltante del Mes**: Diferencia entre el objetivo mensual y lo ahorrado
- **Total General**: Suma acumulada de todos los ahorros
- **Objetivo Actual**: El objetivo en el que se está trabajando actualmente
- Barra de progreso visual

### 💵 Montos
- Lista de montos predefinidos: $4.000, $10.000, $22.000, $50.000, $100.000, $200.000, $500.000, $1.000.000
- Al seleccionar un monto:
  - Se colorea según el perfil de la persona (azul o rosa)
  - Se registra automáticamente como ahorro
  - Aparece en la lista de montos seleccionados
- Los montos seleccionados son visibles para ambos perfiles

### 🎯 Objetivos
- 7 objetivos progresivos:
  1. $1.000.000
  2. $2.000.000
  3. $3.000.000
  4. $5.000.000
  5. $7.000.000
  6. $12.000.000
  7. $20.000.000 (Meta final)
- Los objetivos se marcan automáticamente cuando se alcanzan
- Se muestran tachados cuando están completados
- Fecha de completado visible

### 🎲 Retos
- **Activación**: Los retos aparecen automáticamente el día 1 y 15 de cada mes
- **Selección Aleatoria**: Se elige un reto aleatorio del archivo `data/retos.json`
- **Completado**: Ambos deben completar el reto
- **Penitencia**: Si después de 15 días el reto no se completa, se aplica una penitencia aleatoria
- **Historial**: Se muestra el historial de retos anteriores

### 🌡️ Termómetro Dinámico
- Animación visual que muestra el progreso
- Se actualiza automáticamente cada 5 segundos
- Muestra el objetivo actual y el porcentaje completado
- Cambia de color cuando se alcanza un objetivo
- Líneas de referencia para cada objetivo

## Archivos de Configuración

### `data/retos.json`
Contiene la lista de retos disponibles y penitencias. Puedes editar este archivo para agregar, modificar o eliminar retos.

### `.env.local`
Configuración de la URL de la API:
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Base de Datos

La aplicación usa SQLite para almacenar:
- Usuarios
- Montos seleccionados
- Ahorros registrados
- Objetivos y su estado
- Retos y su progreso

La base de datos se crea automáticamente en `backend/ahorro.db` al ejecutar el backend por primera vez.

## API REST

El backend proporciona endpoints para:
- Gestión de usuarios
- Creación y selección de montos
- Registro de ahorros
- Consulta de estadísticas
- Gestión de objetivos
- Gestión de retos

Documentación disponible en: `http://localhost:8000/docs` (cuando el backend esté corriendo)
