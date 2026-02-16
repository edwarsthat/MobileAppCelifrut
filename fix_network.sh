#!/bin/bash
echo "Configurando interfaz de red enx00e04c6808d0..."
sudo ip link set enx00e04c6808d0 down
sudo ip link set address d8:80:83:8a:9d:4b dev enx00e04c6808d0
sudo ip link set enx00e04c6808d0 up
echo "Obteniendo IP..."
sudo dhclient -v enx00e04c6808d0
echo "Listo."

echo "Configurando ADB reverse..."
adb reverse tcp:3010 tcp:3010
adb reverse tcp:8081 tcp:8081
echo "ADB reverse configurado."
