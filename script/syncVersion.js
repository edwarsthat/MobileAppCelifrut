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
console.log('Construyendo APK...');
execSync('cd android && gradlew assembleRelease', { stdio: 'inherit' });

const serverPath = path.join(__dirname, '..', '..', '..', 'Servidor', 'server', 'updates', 'mobile');
// const serverPath = 'D:\\trabajo\\Celifrut\\Server\\server_gestor_exportacion\\updates\\mobile';

const apkSource = path.join(__dirname, '..', 'android', 'app', 'build', 'outputs', 'apk', 'release', 'app-release.apk');
const apkDestination = path.join(serverPath, `Celifrut_v${version}.apk`);
const apkLatest = path.join(serverPath, 'latest.yml');
let latest;
try {
    if (fs.existsSync(apkLatest)) {
        const fileContents = fs.readFileSync(apkLatest, 'utf8');
        latest = yaml.load(fileContents);
    } else {
        console.log('El archivo latest.yml no existe en la ruta especificada.');
    }
} catch (error) {
    console.error('Error al leer o parsear el archivo:', error);
}


// Actualizar la información de la nueva versión
latest.version = version;
latest.apkPath = `Celifrut_v${version}.apk`; // Ruta del nuevo APK, relativa al servidor
latest.releaseDate = new Date().toISOString();

// Convertir el objeto a YAML
const yamlStr = yaml.dump(latest);

// Guardar el contenido actualizado en latest.yml
fs.writeFileSync(apkLatest, yamlStr, 'utf8');

fs.copyFileSync(apkSource, apkDestination);

console.log(`APK copiado y renombrado a: ${apkDestination}`);
