## Android Google Sign-In kurulumu

### 1. Google Services Gradle eklentisi

Proje seviyesindeki `android/build.gradle` dosyasında Google Maven deposu ve
Google Services eklenti bağımlılığı bulunmalı:

```gradle
buildscript {
    ext {
        buildToolsVersion = "37.0.0"
        minSdkVersion = 24
        compileSdkVersion = 37
        targetSdkVersion = 36
        ndkVersion = "27.1.12297006"
        // Firebase Auth metadata 2.4.0 uyumluluğu
        kotlinVersion = "2.4.20"
    }
    repositories {
        google()
        mavenCentral()
    }
    dependencies {
        classpath("com.android.tools.build:gradle")
        classpath("com.facebook.react:react-native-gradle-plugin")
        classpath("com.google.gms:google-services:4.5.0")
        // Kotlin sürümünü açıkça belirt
        classpath("org.jetbrains.kotlin:kotlin-gradle-plugin:$kotlinVersion")
    }
}

apply plugin: "com.facebook.react.rootproject"
```

Uygulama seviyesindeki `android/app/build.gradle` dosyasında eklentiyi uygula:

```gradle
apply plugin: "com.android.application"
apply plugin: "com.google.gms.google-services"
```

Bu ayarlar projede zaten mevcut; tekrar eklemeyin.

### 2. Firebase uygulama yapılandırması

- Firebase projesi: `fir-auth-7d239`
- Android uygulama kimliği (`applicationId`): `com.firebaseauth`
- Firebase Android yapılandırma dosyası: `android/app/google-services.json`
- JSON içindeki Android uygulamasının paket adı, `com.firebaseauth` ile aynı olmalı.
- `google-services.json`, `android/app` klasöründe bulunmalı. Dosyayı Firebase
  Console'dan yeniden indirirsen mevcut dosyanın üzerine koy.

### 3. Gerekli paketleri kur

Google ile Firebase oturumu için Firebase App ve Auth modülleri ile Google
Sign-In paketi gerekir:

```powershell
npm install @react-native-firebase/app @react-native-firebase/auth @react-native-google-signin/google-signin
```

Yarn kullanıyorsan:

```powershell
yarn add @react-native-firebase/app @react-native-firebase/auth @react-native-google-signin/google-signin
```

Projede bu paketler zaten kurulu. iOS'ta geliştirme yapıyorsan paketleri
kurduktan sonra CocoaPods bağımlılıklarını yükle:

```powershell
cd ios
pod install
cd ..
```

Paket ekledikten sonra Metro'yu ve uygulamayı yeniden başlatıp native uygulamayı
yeniden derle. Android komutları aşağıdaki doğrulama bölümünde yer alıyor.

### 4. Android SHA sertifika parmak izlerini Firebase'e ekle

Google Sign-In Android'de çalışması için imza sertifikalarının SHA-1 ve SHA-256
değerlerini Firebase Console'a kaydet:

1. Firebase Console → Project settings → General → Your apps → Android uygulaması.
2. Kendi bilgisayarındaki güncel SHA değerlerini almak için CMD'yi proje
   klasöründe açıp şu komutu çalıştır:

```cmd
cd /d C:\FirebaseAuth\android
gradlew.bat signingReport
```

Çıktıda `Variant: debug` bölümünün altındaki `SHA1` ve `SHA-256` satırlarını
kullan. Projedeki debug keystore değerlerini doğrudan görmek için de CMD'de
şunu çalıştırabilirsin:

```cmd
cd /d C:\FirebaseAuth\android
keytool -list -v -keystore app\debug.keystore -alias androiddebugkey -storepass android -keypass android
```

3. Firebase Console'da `Add fingerprint` seçeneğiyle bu SHA-1 ve SHA-256
   değerlerini ekle. Bu bilgisayardaki debug keystore'un mevcut değerleri:

```text
SHA-1:   5E:8F:16:06:2E:A3:CD:2C:4A:0D:54:78:76:BA:A6:F3:8C:AB:F6:25
SHA-256: FA:C6:17:45:DC:09:03:78:6F:B9:ED:E6:2A:96:2B:39:9F:73:48:F0:BB:6F:89:9B:83:32:66:75:91:03:3B:9C
```

Bu değerler bu projedeki `android/app/debug.keystore` dosyasından alınmıştır.
Farklı bir makinede veya keystore ile imzalanan sürümde parmak izleri farklıdır.
Yayın sürümü için Play Console'daki **App signing key certificate** SHA-1 ve
SHA-256 değerlerini de Firebase'e ekle.

Firebase Android uygulamasına SHA değerleri eklendikten sonra `google-services.json`
dosyasını tekrar indirip `android/app/google-services.json` konumuna koy.
Dosyada hem Android OAuth istemcisi (client type 1) hem web OAuth istemcisi
(client type 3) bulunmalı.

### 5. Google sağlayıcısını etkinleştir

Firebase Console → Authentication → Sign-in method → Google:

- Google sağlayıcısını etkinleştir.
- Projeye ait destek e-posta adresini seçip kaydet.
- Firebase'in oluşturduğu Web SDK yapılandırmasını Google Sign-In kodundaki
  `webClientId` ile eşleştir. `google-services.json` içindeki `client_type: 3`
  OAuth istemcisinin `client_id` değeri kullanılmalı.

Kodda bu ayar `src/screens/Auth/action.ts` ve `src/screens/Profile/action.ts`
içinde `GoogleSignin.configure({ webClientId })` ile yapılır. İki yerdeki değer
aynı olmalı; `google-services.json` yenilenirse `webClientId` değerinin hâlâ
eşleştiğini kontrol et.

### 6. Uygulama ve giriş akışı

- `@react-native-firebase/app`, `@react-native-firebase/auth` ve
  `@react-native-google-signin/google-signin` bağımlılıkları kurulmuş olmalı.
- Google kullanıcı seçimini `GoogleSignin.signIn()` ile başlat.
- Başarılı yanıttan alınan `idToken` ile
  `GoogleAuthProvider.credential(idToken)` oluştur.
- Firebase oturumunu `signInWithCredential(getAuth(), credential)` ile aç.
- Kullanıcı seçimini iptal ettiğinde bunu hata olarak göstermeden giriş ekranında kal.
- Profil ekranındaki Google butonu mevcut Google giriş işlemini doğrudan başlatır;
  diğer giriş yöntemleri Auth ekranındadır.

### 7. Yeniden derle ve doğrula

`google-services.json` veya Gradle ayarları değiştiğinde Android'i yeniden derle:

```powershell
cd android
.\gradlew.bat :app:processDebugGoogleServices
.\gradlew.bat :app:assembleDebug
```

`DEVELOPER_ERROR` veya `ApiException: 10` görülürse paket adını,
Firebase'deki debug/release SHA parmak izlerini, Google sağlayıcısının etkin
olduğunu ve `webClientId` değerinin Google'ın Web OAuth istemcisi olduğunu
yeniden kontrol et.
