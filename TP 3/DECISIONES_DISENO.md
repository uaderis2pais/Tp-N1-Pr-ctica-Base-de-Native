# Documento de Decisiones de Diseño y Mapeo de Figma - TP3

Este documento detalla las decisiones tomadas durante el desarrollo de la interfaz de usuario para el **TP3 (iBank x Supabase)**, especificando qué elementos del kit de diseño de Figma se mapearon idénticamente, cuáles fueron adaptados por reglas de negocio o desarrollo mobile, y cuáles quedaron fuera de alcance según la consigna oficial.

---

## 🎨 1. Qué se Mapeó del Figma Tal Cual

### 1.1 Paleta de Colores Exacta
* **Púrpura Principal (`#281C9D`)**: Utilizado en el encabezado superior, títulos principales, botones primarios activados, tarjetas bancarias e indicadores de foco.
* **Superficies y Fondos**: Fondo de pantalla `#F8F9FD` y tarjetas contenedoras `#FFFFFF`.
* **Acentos Claros (`#F2F1F9`)**: Usado en el fondo del botón deshabilitado, badges de correo y en el círculo de la ilustración de encabezado.
* **Textos**: Títulos en `#343434` o `#281C9D`, subtítulos y etiquetas en `#898989`, placeholders en `#989898`.
* **Estados Semánticos**: Error `#FF4267` y Éxito `#52D5BA` (Verde agua/Menta para los ítems cumplidos del checklist).

### 1.2 Tipografía Poppins
* Integración exacta de la familia de fuentes **Poppins** (`Regular 400`, `Medium 500`, `SemiBold 600` y `Bold 700`) vía `@expo-google-fonts/poppins`.

### 1.3 Sombras y Radios (`Drop Shadow Card`)
* **Sombra de Tarjetas**: `Drop Shadow Card` idéntica a Figma (`X: 0, Y: 4, Blur: 30, rgba(54, 41, 183, 0.07)`).
* **Curvatura de Tarjeta**: `borderTopLeftRadius: 32` y `borderTopRightRadius: 32` en el contenedor blanco que se acopla a la barra superior púrpura.
* **Radios de Inputs y Botones**: `16px` (`lg`).

### 1.4 Encabezados, Ilustraciones y Verificación OTP (`Forgot password #3 & #4`)
* Barra superior púrpura `#281C9D` con botón de volver `<` en blanco.
* Círculo central de 96px en `#F2F1F9` con el icono central correspondiente a cada pantalla y los **4 puntos decorativos de colores** (Rojo `#FF4267`, Amarillo `#FFAF2A`, Cian `#52D5BA`, Azul `#0890FE`).
* **Paso de Verificación por Código OTP (Marcos `Forgot password #3` y `#4`)**: Pantalla de ingreso del código de 6 dígitos enviado al correo para verificación directa sin depender de navegadores externos.

---

## 🛠️ 2. Qué se Adaptó y Por Qué

1. **Idioma de la Interfaz (Español)**:
   - *Adaptación*: Traducido al español (*"¡Bienvenido de nuevo!"*, *"Iniciar Sesión"*, *"Recuperar Contraseña"*).
   - *Motivo*: Cumplimiento estricto con las reglas de negocio del TP y el entorno universitario.

2. **Checklist Interactivo de Fortaleza de Contraseña**:
   - *Adaptación*: Bloque visual interactivo que evalúa dinámicamente los 5 requisitos de clave.
   - *Motivo*: Requerimiento explícito de la Sección 6.2 del TP para feedback visual en tiempo real.

3. **Soporte Híbrido: Enlace Deep Link + Código de 6 Dígitos (OTP)**:
   - *Adaptación*: Permite verificar cuentas y reseteo de claves ingresando el código de 6 dígitos enviado por mail o abriendo el deep link.
   - *Motivo*: Resuelve las restricciones de seguridad de navegadores móviles (Brave, Chrome) que bloquean la apertura automática de esquemas de apps tras un 302 redirect.

4. **Excepción Diferenciada para Email No Registrado**:
   - *Adaptación*: En Login, si el email ingresado no existe en la base de datos, informa explícitamente *"No existe una cuenta registrada con este correo electrónico"*.

5. **Bloqueo por Biometría/PIN al volver a la App (Estilo MercadoPago)**:
   - *Adaptación*: Al minimizar la app teniendo la sesión iniciada y volver del segundo plano, se despliega la pantalla de bloqueo solicitando Face ID, Huella o PIN.
   - *Motivo*: Mejora de seguridad bancaria mobile siguiendo estándares de aplicaciones fintech como MercadoPago.

6. **Modal de CAPTCHA Obligatorio (hCaptcha / Turnstile)**:
   - *Adaptación*: Integración de `CaptchaModal.tsx` vía WebView con validación de `captchaToken` en Supabase.
   - *Motivo*: Requisito de la tabla del Punto 08 de la consigna para sumar puntos extra.

---

## 🚫 3. Qué Quedó Fuera de Alcance

Según lo establecido en el **Punto 01 (Objetivo y alcance)** de la consigna oficial:

* **Login Social (OAuth con Google / Apple / Facebook)**: Excluido del alcance obligatorio.
* **Verificación por SMS (OTP Celular)**: Excluido (Se utiliza OTP vía correo electrónico).
* **Desarrollo de API Propia**: No aplica (Backend BaaS Supabase Auth).
