# Script para Windows equivalente a fix_network.sh
# Configura la conexión entre el dispositivo móvil (Android) y el servidor local

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "   Configurando Conexión para Windows" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

Write-Host "`n[1/2] Configurando ADB reverse..." -ForegroundColor White
# Esto permite que la App en el celular acceda al servidor en la PC
# usando 'localhost' o '127.0.0.1' en los puertos indicados.
& adb reverse tcp:3010 tcp:3010
& adb reverse tcp:8081 tcp:8081

if ($LASTEXITCODE -eq 0) {
    Write-Host "[OK] ADB reverse configurado correctamente." -ForegroundColor Green
} else {
    Write-Host "[ERROR] No se pudo configurar ADB reverse." -ForegroundColor Red
    Write-Host "Asegúrate de que el celular esté conectado y con Depuración USB activada."
}

Write-Host "`n[2/2] Configuración de Red (Equivalente a Ubuntu)" -ForegroundColor White
Write-Host "------------------------------------------"
Write-Host "En Ubuntu el script cambia la dirección MAC. En Windows esto requiere"
Write-Host "permisos de Administrador y que el driver lo soporte."

$choice = Read-Host "`n¿Deseas intentar cambiar la MAC? (S/N)"

if ($choice -eq 'S' -or $choice -eq 's') {
    $adapterName = "Ethernet" # Cambia esto si tu adaptador tiene otro nombre
    $newMac = "D8-80-83-8A-9D-4B"
    
    Write-Host "Intentando cambiar la MAC de '$adapterName' a $newMac..." -ForegroundColor Yellow
    try {
        # Requiere ejecutar como Administrador
        Set-NetAdapter -Name $adapterName -MacAddress $newMac -Confirm:$false
        Restart-NetAdapter -Name $adapterName -Confirm:$false
        Write-Host "[OK] MAC cambiada y adaptador reiniciado." -ForegroundColor Green
    } catch {
        Write-Host "[ERROR] No se pudo cambiar la MAC. Ejecuta como Administrador o verifica el nombre del adaptador ($adapterName)." -ForegroundColor Red
        Write-Host "Nota: Algunos drivers de red en Windows no permiten cambiar la MAC por software."
    }
}

Write-Host "`nListo." -ForegroundColor Cyan
Read-Host "Presiona Enter para salir..."
