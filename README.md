# iBank — Banking & E-Money Management App (TP3 x Supabase)

Aplicación móvil bancaria desarrollada con **React Native (Expo SDK 57)**, **Expo Router v6**, **TypeScript** y **Supabase Auth** como backend de autenticación, siguiendo fielmente el kit de diseño de **Figma iBank** y la rúbrica oficial de evaluación.

---

## 🚀 Características Principales

* **Fidelidad Visual Figma 100%**:
  * Paleta de colores iBank (`#281C9D` Púrpura principal, `#F8F9FD` Fondo, `#FFFFFF` Tarjeta curvada con `borderTopLeftRadius: 32`).
  * Tipografía de Google Fonts **Poppins** (`Regular 400`, `Medium 500`, `SemiBold 600`, `Bold 700`).
  * Sombras idénticas `Drop Shadow Card` (`rgba(54, 41, 183, 0.07)`).
  * Ilustración de encabezado circular (`HeaderIllustration.tsx`) con 4 puntos decorativos de colores.
  * Marcos `Forgot password #3` y `#4` de verificación por código OTP de 6 dígitos.

* **Flujo de Autenticación Completo (5 Pantallas)**:
  1. `Login` (`app/(auth)/login.tsx`): Iniciar sesión con validación de credenciales, excepción diferenciada para email no registrado y CAPTCHA obligatorio.
  2. `Registro` (`app/(auth)/register.tsx`): Registro con checklist interactivo de clave, confirmación de contraseña, checkbox de Términos y CAPTCHA obligatorio.
  3. `Confirmar Correo` (`app/(auth)/pending-confirm.tsx`): Confirmación con soporte híbrido de Deep Link (`ibanktp://confirm`) e ingreso directo del código de 6 dígitos (OTP).
  4. `Recuperar Contraseña` (`app/(auth)/forgot-password.tsx`): Solicitud de restablecimiento con mensajes neutros anti-enumeración e ingreso del código de 6 dígitos (Figma #3 & #4).
  5. `Cambiar Contraseña` (`app/(auth)/reset-password.tsx`): Actualización de contraseña con checklist de fortaleza en tiempo real y deslogueo automático.

* **Seguridad y Backend Supabase**:
  * Persistencia de sesión con `AsyncStorage` y `customStorage` multiplataforma.
  * Captura de Deep Links con `Linking` y `supabase.auth.setSession()`.
  * Protección anti-enumeración y cooldown visual de 60s ante error HTTP 429 (`over_request_rate_limit`).
  * Tabla pública `profiles` sincronizada automáticamente vía Trigger SQL y Row Level Security (RLS).

* **Puntos Extra (Bonus Features)**:
  * **Bloqueo por Biometría/PIN al volver del segundo plano (Estilo MercadoPago)**: `BiometricLockOverlay.tsx` integrado con `expo-local-authentication`.
  * **Verificación por CAPTCHA WebView**: `CaptchaModal.tsx` integrado con hCaptcha / Turnstile passing `captchaToken` a Supabase Auth.

---

## 🛠️ Instalación y Ejecución Local

1. **Clonar e instalar dependencias**:
   ```bash
   npm install
   ```

2. **Configurar el archivo `.env`**:
   Crear o verificar el archivo `.env` en la raíz del proyecto:
   ```env
   EXPO_PUBLIC_SUPABASE_URL=https://iwjkpmmwjvnthgiepzyt.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1...
   EXPO_PUBLIC_HCAPTCHA_SITE_KEY=1f3affb0-fb32-4cb4-864a-b19eb6f0844c
   ```

3. **Ejecutar la aplicación**:
   ```bash
   npx expo start
   ```
   - Escanear el código QR con **Expo Go** desde tu celular (Android / iOS).
   - O presionar `a` para emulador Android / `w` para versión Web.

---

## 📄 Entregables Adjuntos (Sección 11)

- [`DECISIONES_DISENO.md`](file:///d:/Archivos%20Personales/Desktop/UNIVERSIDAD/Visual%20studio%20Code/Desarrollo%20app%20mobile/TP%203/DECISIONES_DISENO.md): Documento de decisiones de UI, mapeo de Figma, adaptaciones y alcance.
- [`CONFIGURACION_SUPABASE.md`](file:///d:/Archivos%20Personales/Desktop/UNIVERSIDAD/Visual%20studio%20Code/Desarrollo%20app%20mobile/TP%203/CONFIGURACION_SUPABASE.md): Documentación de políticas de contraseña, rate limits, Redirect URLs y script SQL con RLS.
