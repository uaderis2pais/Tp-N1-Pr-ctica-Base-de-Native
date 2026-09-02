# Documentación de Configuración de Supabase y Seguridad - TP3

Este documento detalla la configuración técnica del backend **Supabase Auth**, la revisión de la **Sección 08 (Seguridad Recomendada en el Dashboard)**, los parámetros de base de datos y la implementación de las **Funcionalidades Extra (Biometría Local y CAPTCHA)** para el proyecto **iBank TP3**.

---

## 🔑 1. Credenciales y Variables de Entorno

El proyecto se encuentra vinculado al servidor de Supabase mediante las siguientes variables públicas definidas en el archivo `.env`:

```env
EXPO_PUBLIC_SUPABASE_URL=https://iwjkpmmwjvnthgiepzyt.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3...
EXPO_PUBLIC_HCAPTCHA_SITE_KEY=1f3affb0-fb32-4cb4-864a-b19eb6f0844c
```

---

## 📋 2. Checklist de la Sección 08 (Seguridad Recomendada)

| Ítem | Recomendación de la Consigna | Configuración Implementada |
| :--- | :--- | :--- |
| **Longitud mínima de contraseña** | 8 caracteres como piso | ✅ Configurado en `8` en Supabase Auth -> Password Protection y validado en Zod. |
| **Complejidad de contraseña** | Exigir mayúscula, minúscula, dígito y símbolo | ✅ Exigido en el Dashboard y evaluado en tiempo real en la UI (`PasswordChecklist.tsx`). |
| **Leaked password protection** | Activar si está disponible | ✅ Evaluado en las políticas de seguridad de Auth. |
| **Confirm email** | Activo en producción | ✅ Activado en Supabase Auth -> Email Provider (*Enable Email Confirmations*). |
| **Rate limits** | 60s de cooldown por usuario en signup/recover | ✅ Manejado con temporizador visual de 60s en UI ante error HTTP 429 (`over_request_rate_limit`). |
| **Expiración de link/OTP** | 3600 segundos (1 hora) o menos | ✅ Tokens configurados a 3600s en el Dashboard. |
| **SMTP** | Límite de 2 emails/hora en desarrollo | ✅ Documentado y soportado mediante verificación híbrida de código OTP en app. |
| **Redirect URLs** | Agregar scheme de la app a la allowlist | ✅ `ibanktp://*`, `exp://*`, `http://localhost:*` agregados en URL Configuration. |
| **CAPTCHA (Bonus)** | hCaptcha o Turnstile en signup, signin, reset | ✅ **Implementado** vía `CaptchaModal.tsx` (`react-native-webview`) pasando `captchaToken`. |
| **Claves de API** | Solo la anon key vive en el cliente | ✅ Verificado: únicamente `EXPO_PUBLIC_SUPABASE_ANON_KEY` en `.env`. 0 clave `service_role`. |

---

## 🔗 3. Redirect URLs Configuradas (Allowlist)

En la sección **Authentication -> URL Configuration**, se agregaron los siguientes esquemas permitidos para capturar los Deep Links desde Gmail hacia la aplicación:

* **Site URL**: `ibanktp://`
* **Redirect URLs Permitidas (Allowlist)**:
  * `ibanktp://*`
  * `ibanktp://confirm` (Deep link para confirmación de correo)
  * `ibanktp://reset-password` (Deep link para restablecimiento de contraseña)
  * `exp://*` (**Requerido para redirigir hacia la app en desarrollo dentro de Expo Go**)
  * `http://localhost:*` (**Requerido para redirigir si se prueba la app desde la versión Web**)

---

## 🗄️ 4. Estructura de Base de Datos: Tabla `profiles` (Puntos Extra)

Para sincronizar los metadatos ingresados en el registro (`full_name`) con una tabla pública protegida por **Row Level Security (RLS)**, se ejecutó el siguiente script en el SQL Editor de Supabase:

```sql
-- 1. Crear tabla pública de perfiles
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- 2. Habilitar Row Level Security (RLS)
alter table public.profiles enable row level security;

-- 3. Políticas de Acceso RLS
create policy "Los perfiles públicos son visibles únicamente por su dueño"
  on public.profiles
  for select using (auth.uid() = id);

create policy "Los usuarios pueden actualizar su propio perfil"
  on public.profiles
  for update using (auth.uid() = id);

-- 4. Función y Trigger de Sincronización Automática
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```
