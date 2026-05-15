-- =====================================================
-- CHEFFY — Schema SQL para Supabase
-- Ejecuta este SQL en el SQL Editor de tu proyecto Supabase
-- =====================================================

-- ─── TABLA: items ─────────────────────────────────────────────────────────────
CREATE TABLE public.items (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  nombre text NOT NULL,
  categoria_id text NOT NULL DEFAULT 'otros',
  emoji text DEFAULT '📦',
  icon_url text,
  en_lista boolean DEFAULT false,
  tengo boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Índice para búsquedas por usuario
CREATE INDEX items_user_id_idx ON public.items(user_id);

-- RLS: cada usuario solo ve sus items
ALTER TABLE public.items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD own items" ON public.items
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);


-- ─── TABLA: recipes ───────────────────────────────────────────────────────────
CREATE TABLE public.recipes (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  nombre text NOT NULL,
  fuente text DEFAULT 'propia',
  ingredientes jsonb DEFAULT '[]',
  pasos jsonb DEFAULT '[]',
  foto text,
  categoria_receta text,
  youtube text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX recipes_user_id_idx ON public.recipes(user_id);

ALTER TABLE public.recipes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD own recipes" ON public.recipes
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);


-- ─── TABLA: platos ────────────────────────────────────────────────────────────
CREATE TABLE public.platos (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  nombre text NOT NULL,
  emoji text DEFAULT '🍽️',
  icon_url text,
  ingrediente_ids jsonb DEFAULT '[]',
  created_at timestamptz DEFAULT now()
);

CREATE INDEX platos_user_id_idx ON public.platos(user_id);

ALTER TABLE public.platos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD own platos" ON public.platos
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);


-- ─── STORAGE BUCKET: icons ────────────────────────────────────────────────────
-- Ejecuta esto también para crear el bucket de iconos:
INSERT INTO storage.buckets (id, name, public)
VALUES ('icons', 'icons', true)
ON CONFLICT DO NOTHING;

-- Política: usuarios autenticados pueden subir a su propia carpeta
CREATE POLICY "Users can upload own icons" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'icons' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Anyone can view icons" ON storage.objects
  FOR SELECT USING (bucket_id = 'icons');

CREATE POLICY "Users can delete own icons" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'icons' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );