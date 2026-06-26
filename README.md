# Aplicacion Movil de Gestion de Empaque y Exportacion

**Autor:** Edwar Stheven Ariza Torres
**Version:** 1.14.1

> **Aviso Legal y Licencia**
>
> Este software es propiedad intelectual de Edwar Stheven Ariza Torres y se desarrolla para uso exclusivo de la empresa **Celifrut**. Todos los derechos de explotacion, uso y distribucion corresponden unicamente a Celifrut, pero el derecho de autor intelectual permanece en cabeza del desarrollador original.
>
> Queda prohibida la copia, distribucion o uso fuera de la empresa sin autorizacion expresa y por escrito del autor y de Celifrut.

Aplicacion movil (React Native) que sirve como cliente operativo del sistema de gestion de empaque, procesamiento y exportacion de frutas de Celifrut. Permite al personal de planta registrar y consultar informacion directamente desde el punto de trabajo: control de calidad, ingresos de fruta, inventarios, logistica y seguimiento de los procesos de empaque. Se comunica en tiempo real con el servidor backend mediante sockets.

---

## Modulos

- **Calidad** — Ingreso de formularios de control de calidad, clasificacion de descarte, registro de higiene del personal y captura de fotos de calidad.
- **Comercial** — Gestion y consulta de proveedores.
- **Inventario y Logistica** — Consulta y manejo de inventarios.
- **Proceso** — Aplicaciones de planta: descarte en encerado, descarte en lavado, fotos de calidad y lista de empaque.
- **Menu** — Navegacion central hacia cada area operativa.

## Tecnologias

- **React Native** 0.78 / **React** 19
- **TypeScript**
- **Zustand** para el manejo de estado
- **Zod** para validacion de datos
- **Socket.IO** para la comunicacion en tiempo real con el backend
- **React Native Vision Camera** para la captura de fotos de calidad
- **React Native Keychain** para el almacenamiento seguro de credenciales

---

# Puesta en marcha

> **Nota**: Antes de continuar, asegurate de haber completado la guia oficial de [configuracion de entorno de React Native](https://reactnative.dev/docs/environment-setup) hasta el paso "Creating a new application".

## Paso 1: Instalar dependencias

```bash
npm install
```

## Paso 2: Iniciar Metro

Metro es el _bundler_ de JavaScript que se incluye con React Native. Desde la raiz del proyecto:

```bash
npm start
```

## Paso 3: Ejecutar la aplicacion

Deja Metro corriendo en su propia terminal. Abre una nueva terminal desde la raiz del proyecto y ejecuta:

### Android

```bash
npm run android
```

### iOS

```bash
npm run ios
```

Si todo esta configurado correctamente, la aplicacion se abrira en tu emulador de Android o simulador de iOS. Tambien puedes ejecutarla directamente desde Android Studio o Xcode.

---

# Generar version de produccion (Android)

El proyecto sincroniza la version antes de compilar el APK de release:

```bash
# Linux / macOS
npm run android-release

# Windows
npm run android-release-win
```

La sincronizacion de version tambien puede ejecutarse de forma independiente:

```bash
npm run sync-version
```

---

# Scripts disponibles

| Script | Descripcion |
| --- | --- |
| `npm start` | Inicia el servidor de Metro. |
| `npm run android` | Compila y ejecuta la app en Android. |
| `npm run ios` | Compila y ejecuta la app en iOS. |
| `npm run lint` | Ejecuta ESLint sobre el proyecto. |
| `npm test` | Ejecuta las pruebas con Jest. |
| `npm run android-release` | Sincroniza la version y genera el APK de release (Linux/macOS). |
| `npm run android-release-win` | Sincroniza la version y genera el APK de release (Windows). |
| `npm run sync-version` | Sincroniza el numero de version del proyecto. |

---

# Solucion de problemas

Si la aplicacion no compila o no se ejecuta, revisa la guia oficial de [Troubleshooting de React Native](https://reactnative.dev/docs/troubleshooting).
