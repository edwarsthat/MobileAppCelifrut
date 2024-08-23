package com.mobileappcelifrut

import android.content.Intent
import android.net.Uri
import android.os.Build
import androidx.core.content.FileProvider
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise
import java.io.File
class ApkInstallerModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    override fun getName() = "ApkInstaller"

    @ReactMethod
    fun installApk(filePath:String, promise:Promise){
        try {
            val file = File(filePath)
            if (!file.exists()) {
                throw Exception("El archivo APK no existe en la ruta especificada")
            }

            val intent = Intent(Intent.ACTION_VIEW)
            val uri = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
                FileProvider.getUriForFile(reactApplicationContext, "${reactApplicationContext.packageName}.provider", file)
            } else {
                Uri.fromFile(file)
            }

            intent.setDataAndType(uri, "application/vnd.android.package-archive")
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            intent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)
            reactApplicationContext.startActivity(intent)

            promise.resolve("Instalación iniciada")
        } catch (e: Exception) {
            promise.reject("ERROR", e.message)
        }
    }
}