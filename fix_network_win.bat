@echo off
:: Script para Windows equivalente a fix_network.sh
:: Configura la conexión entre el dispositivo móvil (Android) y el servidor local

echo ==========================================
echo   Configurando Conexion para Windows
echo ==========================================

echo.
echo [1/2] Configurando ADB reverse...
:: Esto permite que la App en el celular acceda al servidor en la PC
:: usando 'localhost' o '127.0.0.1' en los puertos indicados.
adb reverse tcp:3010 tcp:3010
adb reverse tcp:8081 tcp:8081

if %ERRORLEVEL% EQU 0 (
    echo [OK] ADB reverse configurado correctamente.
) else (
    echo [ERROR] No se pudo configurar ADB reverse. 
    echo Asegurate de que el celular este conectado y con Depuracion USB activada.
)

echo.
echo [2/2] Configuracion de Red (Opcional)
echo ------------------------------------------
echo En Ubuntu el script cambia la MAC address. En Windows esto suele requerir
echo permisos de Administrador y depende del driver de red.
echo.
echo Si necesitas cambiar la MAC (como en Ubuntu), ejecuta este archivo 
echo COMO ADMINISTRADOR y edita las variables en el script si es necesario.
echo.

:: Si deseas automatizar el cambio de MAC descomenta las siguientes lineas:
:: set ADAPTER_NAME="Ethernet"
:: set NEW_MAC="D8-80-83-8A-9D-4B"
:: powershell -Command "Set-NetAdapter -Name %ADAPTER_NAME% -MacAddress %NEW_MAC% -Confirm:$false"
:: powershell -Command "Restart-NetAdapter -Name %ADAPTER_NAME%"

echo Listo.
pause
