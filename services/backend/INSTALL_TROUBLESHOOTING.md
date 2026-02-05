# Solución de Problemas de Instalación

## Error: Rust/Cargo requerido para pydantic-core

Si encuentras un error relacionado con Rust al instalar las dependencias, aquí hay varias soluciones:

### Solución 1: Usar versiones con wheels precompilados (Recomendado)

El archivo `requirements.txt` ya está configurado con versiones que tienen wheels precompilados. Si aún tienes problemas, prueba:

```bash
pip install --only-binary :all: -r requirements.txt
```

### Solución 2: Instalar Rust (Si la solución 1 no funciona)

1. Descarga e instala Rust desde: https://rustup.rs/
2. Reinicia tu terminal
3. Intenta instalar nuevamente:
```bash
pip install -r requirements.txt
```

### Solución 3: Usar versión alternativa

Si las versiones principales fallan, usa el archivo alternativo:

```bash
pip install -r requirements-alt.txt
```

### Solución 4: Instalar pydantic desde wheel precompilado

```bash
pip install pydantic --only-binary pydantic
pip install -r requirements.txt
```

### Solución 5: Usar Python 3.11 o 3.12

Las versiones más recientes de Python (3.11, 3.12) tienen mejor soporte para wheels precompilados. Si estás usando Python 3.13, considera usar 3.12.

### Verificar versión de Python

```bash
python --version
```

Si estás usando Python 3.13, puede que algunas librerías aún no tengan wheels precompilados. Considera usar Python 3.12.
