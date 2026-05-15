# Spec 14 — Migración a Supabase (BBDD + Auth + Storage)

## Objetivo
Migrar el almacenamiento de localStorage a Supabase para:
- Datos sincronizados en la nube
- Login con Google y email/contraseña
- Soporte multi-usuario (cada usuario ve solo sus datos)
- Storage para iconos de imagen personalizados

## Credenciales
- Project URL: `https://gpgbwganylrfedfakdky.supabase.co`
- Anon Key: en `.env` (no en código fuente)

## Tablas en Supabase

### `items`
| Campo | Tipo | Descripción |
|---|---|---|
| id | uuid (PK) | ID único |
| user_id | uuid (FK auth.users) | Propietario |
| nombre | text | Nombre del producto |
| categoria_id | text | ID de categoría |
| emoji | text | Emoji o null |
| icon_url | text | URL de imagen personalizada o null |
| en_lista | boolean | Está en lista de compra |
| tengo | boolean | Está en despensa |
| created_at | timestamptz | Fecha creación |

### `recipes`
| Campo | Tipo | Descripción |
|---|---|---|
| id | uuid (PK) | ID único |
| user_id | uuid | Propietario |
| nombre | text | Nombre receta |
| fuente | text | 'propia' o 'mealdb' |
| ingredientes | jsonb | Array de {nombre, cantidad} |
| pasos | jsonb | Array de strings |
| foto | text | URL o base64 |
| categoria_receta | text | Categoría |
| youtube | text | URL YouTube |
| created_at | timestamptz | Fecha creación |

### `platos`
| Campo | Tipo | Descripción |
|---|---|---|
| id | uuid (PK) | ID único |
| user_id | uuid | Propietario |
| nombre | text | Nombre plato |
| emoji | text | Emoji o null |
| icon_url | text | URL imagen o null |
| ingrediente_ids | jsonb | Array de item IDs |
| created_at | timestamptz | Fecha creación |

## Row Level Security (RLS)
Cada tabla tiene RLS activo: los usuarios solo pueden CRUD sus propios datos.

## Auth
- Google OAuth
- Email + contraseña (con confirmación de email)

## Storage
- Bucket: `icons` (público)
- Ruta: `icons/{user_id}/{uuid}.png`

## Archivos
- `.env` — variables de entorno (no en git)
- `src/lib/supabase.js` — cliente Supabase
- `src/store/useAuthStore.js` — estado de autenticación
- `src/pages/Login.jsx` — pantalla de login/registro
- `src/App.jsx` — envolver app con auth
- `src/store/useStore.js` — migrar operaciones a Supabase