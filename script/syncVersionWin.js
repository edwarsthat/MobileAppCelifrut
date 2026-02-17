const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const yaml = require("js-yaml");

// Leer la versión de package.json
const packageJson = require('../package.json');
const version = packageJson.version;

// Actualizar la version de la app build.gradle
const gradlePath = path.join(__dirname, '../', 'android', 'app', 'build.gradle');

let gradleContent = fs.readFileSync(gradlePath, 'utf8');
gradleContent = gradleContent.replace(
    /versionName "(.*)"/,
    `versionName "${version}"`
);
fs.writeFileSync(gradlePath, gradleContent);

//se crea la apk
console.log('Construyendo APK (Windows)...');
execSync('cd android && gradlew assembleRelease', { stdio: 'inherit' });

// Ruta de salida local en el proyecto
const outPath = path.join(__dirname, '..', 'out');

// Crear la carpeta 'out' si no existe
if (!fs.existsSync(outPath)) {
    fs.mkdirSync(outPath, { recursive: true });
    console.log('Carpeta "out" creada.');
}

const apkSource = path.join(__dirname, '..', 'android', 'app', 'build', 'outputs', 'apk', 'release', 'app-release.apk');
const apkDestination = path.join(outPath, `Celifrut_v${version}.apk`);
const apkLatest = path.join(outPath, 'latest.yml');

let latest;
try {
    if (fs.existsSync(apkLatest)) {
        const fileContents = fs.readFileSync(apkLatest, 'utf8');
        latest = yaml.load(fileContents);
    } else {
        console.log('El archivo latest.yml no existe, creando uno nuevo...');
        latest = {
            version: version,
            apkPath: `Celifrut_v${version}.apk`,
            releaseDate: new Date().toISOString()
        };
    }
} catch (error) {
    console.error('Error al leer o parsear el archivo:', error);
    latest = {
        version: version,
        apkPath: `Celifrut_v${version}.apk`,
        releaseDate: new Date().toISOString()
    };
}

// Actualizar la información de la nueva versión
latest.version = version;
latest.apkPath = `Celifrut_v${version}.apk`;
latest.releaseDate = new Date().toISOString();

// Convertir el objeto a YAML
const yamlStr = yaml.dump(latest);

// Guardar el contenido actualizado en latest.yml
fs.writeFileSync(apkLatest, yamlStr, 'utf8');
console.log(`Archivo latest.yml actualizado en: ${apkLatest}`);

fs.copyFileSync(apkSource, apkDestination);
console.log(`APK copiado y renombrado a: ${apkDestination}`);
