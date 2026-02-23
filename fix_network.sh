#!/bin/bash

# ── 1. Configurar interfaz de red ──────────────────────────────────────────────
echo "Configurando interfaz de red enx00e04c6808d0..."
sudo ip link set enx00e04c6808d0 down
sudo ip link set address d8:80:83:8a:9d:4b dev enx00e04c6808d0
sudo ip link set enx00e04c6808d0 up
echo "Obteniendo IP..."
sudo dhclient -v enx00e04c6808d0
echo "Red configurada."

# ── 2. Esperar a que ADB detecte el dispositivo ────────────────────────────────
echo "Esperando dispositivo ADB..."
TIMEOUT=30
ELAPSED=0
while ! adb devices | grep -q "device$"; do
    if [ "$ELAPSED" -ge "$TIMEOUT" ]; then
        echo "ERROR: No se detectó ningún dispositivo ADB tras ${TIMEOUT}s."
        echo "Verifica que la tablet esté conectada y que tenga la depuración USB habilitada."
        exit 1
    fi
    sleep 1
    ELAPSED=$((ELAPSED + 1))
done
echo "Dispositivo detectado."

# ── 3. Configurar adb reverse ──────────────────────────────────────────────────
echo "Configurando ADB reverse..."
adb reverse tcp:3010 tcp:3010 || { echo "ERROR: falló adb reverse tcp:3010"; exit 1; }
adb reverse tcp:8081 tcp:8081 || { echo "ERROR: falló adb reverse tcp:8081"; exit 1; }

echo ""
echo "Reglas activas:"
adb reverse --list

echo ""
echo "Listo."
