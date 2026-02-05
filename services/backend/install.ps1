# Script de instalación para Windows PowerShell
# Este script intenta instalar las dependencias con diferentes métodos

Write-Host "Instalando dependencias del backend..." -ForegroundColor Green

# Método 1: Instalación normal
Write-Host "`nIntento 1: Instalación normal..." -ForegroundColor Yellow
pip install -r requirements.txt

if ($LASTEXITCODE -ne 0) {
    Write-Host "`nIntento 1 falló. Intentando con --only-binary..." -ForegroundColor Yellow
    
    # Método 2: Solo wheels precompilados
    pip install --only-binary :all: -r requirements.txt
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "`nIntento 2 falló. Intentando con upgrade pip..." -ForegroundColor Yellow
        
        # Método 3: Actualizar pip primero
        python -m pip install --upgrade pip
        pip install -r requirements.txt
        
        if ($LASTEXITCODE -ne 0) {
            Write-Host "`nTodos los intentos fallaron." -ForegroundColor Red
            Write-Host "Por favor, instala Rust desde https://rustup.rs/ o usa Python 3.12" -ForegroundColor Red
            exit 1
        }
    }
}

Write-Host "`n¡Instalación completada exitosamente!" -ForegroundColor Green
