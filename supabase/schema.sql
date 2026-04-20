-- ══════════════════════════════════════════════════════════════════════════════
-- CLUBECRM — Schema Supabase
-- Execute este script no SQL Editor do seu projeto Supabase:
-- Dashboard → SQL Editor → New Query → Cole e Execute
-- ══════════════════════════════════════════════════════════════════════════════

-- Habilitar extensão UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── ENUM TYPES ────────────────────────────────────────────────────────────────
CREATE TYPE plan_type AS ENUM ('free', 'pro', 'enterprise');
CREATE TYPE newsletter_status AS ENUM ('draft', 'scheduled', 'sent');

-- ── PROFILES (sincronizado com auth.users) ────────────────────────────────────
CREATE TABLE public.profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email       TEXT NOT NULL UNIQUE,
  name        TEXT NOT NULL,
  avatar_url  TEXT,
  plan        plan_type NOT NULL DEFAULT 'free',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auto-criar profile ao registrar usuário
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Auto-atualizar updated_at
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$;

-- ── PROJECTS ──────────────────────────────────────────────────────────────────
CREATE TABLE public.projects (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id       UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name           TEXT NOT NULL,
  description    TEXT,
  color          TEXT NOT NULL DEFAULT '#1d6aff',
  icon           TEXT NOT NULL DEFAULT '◈',
  funnel_stages  TEXT[] NOT NULL DEFAULT ARRAY['novo','contato','qualificado','proposta','fechado'],
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ── LEADS ─────────────────────────────────────────────────────────────────────
CREATE TABLE public.leads (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id            UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  name                  TEXT NOT NULL,
  email                 TEXT NOT NULL,
  phone                 TEXT,
  company               TEXT,
  tags                  TEXT[] NOT NULL DEFAULT '{}',
  score                 INTEGER NOT NULL DEFAULT 40 CHECK (score >= 0 AND score <= 100),
  stage                 TEXT NOT NULL DEFAULT 'novo',
  source                TEXT DEFAULT 'Manual',
  notes                 TEXT,
  newsletter_subscribed BOOLEAN NOT NULL DEFAULT FALSE,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX leads_project_id_idx ON public.leads(project_id);
CREATE INDEX leads_email_idx      ON public.leads(email);
CREATE INDEX leads_stage_idx      ON public.leads(stage);

CREATE TRIGGER leads_updated_at
  BEFORE UPDATE ON public.leads
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ── FORMS ─────────────────────────────────────────────────────────────────────
CREATE TABLE public.forms (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id  UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  fields      TEXT[] NOT NULL DEFAULT ARRAY['Nome','E-mail','Telefone'],
  tag         TEXT NOT NULL,
  submissions INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX forms_project_id_idx ON public.forms(project_id);

-- ── NEWSLETTERS ───────────────────────────────────────────────────────────────
CREATE TABLE public.newsletters (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id    UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  title         TEXT NOT NULL,
  subject       TEXT NOT NULL,
  content       TEXT,
  status        newsletter_status NOT NULL DEFAULT 'draft',
  sent_count    INTEGER NOT NULL DEFAULT 0,
  opened_count  INTEGER NOT NULL DEFAULT 0,
  clicked_count INTEGER NOT NULL DEFAULT 0,
  scheduled_at  TIMESTAMPTZ,
  sent_at       TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX newsletters_project_id_idx ON public.newsletters(project_id);

-- ── LANDING PAGES ─────────────────────────────────────────────────────────────
CREATE TABLE public.landing_pages (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id   UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  title        TEXT NOT NULL,
  slug         TEXT NOT NULL,
  template     TEXT NOT NULL DEFAULT 'blank',
  blocks       JSONB NOT NULL DEFAULT '[]'::jsonb,
  published    BOOLEAN NOT NULL DEFAULT FALSE,
  published_at TIMESTAMPTZ,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(project_id, slug)
);

CREATE INDEX landing_pages_project_id_idx ON public.landing_pages(project_id);
CREATE INDEX landing_pages_slug_idx       ON public.landing_pages(slug);

CREATE TRIGGER landing_pages_updated_at
  BEFORE UPDATE ON public.landing_pages
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ── PASSWORD RESET TOKENS ─────────────────────────────────────────────────────
CREATE TABLE public.password_reset_tokens (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  token_hash  TEXT NOT NULL UNIQUE,
  expires_at  TIMESTAMPTZ NOT NULL,
  used        BOOLEAN NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Limpar tokens expirados automaticamente (executar via cron ou pg_cron)
-- SELECT cron.schedule('0 * * * *', 'DELETE FROM password_reset_tokens WHERE expires_at < NOW()');

-- ══════════════════════════════════════════════════════════════════════════════
-- ROW LEVEL SECURITY (RLS)
-- Cada usuário só vê e edita seus próprios dados
-- ══════════════════════════════════════════════════════════════════════════════

ALTER TABLE public.profiles       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forms          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletters    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.landing_pages  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.password_reset_tokens ENABLE ROW LEVEL SECURITY;

-- PROFILES
CREATE POLICY "profiles: ver próprio" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles: editar próprio" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- PROJECTS
CREATE POLICY "projects: ver próprios" ON public.projects FOR SELECT USING (auth.uid() = owner_id);
CREATE POLICY "projects: criar" ON public.projects FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "projects: editar próprios" ON public.projects FOR UPDATE USING (auth.uid() = owner_id);
CREATE POLICY "projects: deletar próprios" ON public.projects FOR DELETE USING (auth.uid() = owner_id);

-- LEADS (via projeto)
CREATE POLICY "leads: ver do projeto" ON public.leads FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.projects WHERE id = leads.project_id AND owner_id = auth.uid()));
CREATE POLICY "leads: criar no projeto" ON public.leads FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM public.projects WHERE id = leads.project_id AND owner_id = auth.uid()));
CREATE POLICY "leads: editar no projeto" ON public.leads FOR UPDATE
  USING (EXISTS (SELECT 1 FROM public.projects WHERE id = leads.project_id AND owner_id = auth.uid()));
CREATE POLICY "leads: deletar no projeto" ON public.leads FOR DELETE
  USING (EXISTS (SELECT 1 FROM public.projects WHERE id = leads.project_id AND owner_id = auth.uid()));

-- FORMS
CREATE POLICY "forms: ver do projeto" ON public.forms FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.projects WHERE id = forms.project_id AND owner_id = auth.uid()));
CREATE POLICY "forms: criar" ON public.forms FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM public.projects WHERE id = forms.project_id AND owner_id = auth.uid()));
CREATE POLICY "forms: editar" ON public.forms FOR UPDATE
  USING (EXISTS (SELECT 1 FROM public.projects WHERE id = forms.project_id AND owner_id = auth.uid()));
CREATE POLICY "forms: deletar" ON public.forms FOR DELETE
  USING (EXISTS (SELECT 1 FROM public.projects WHERE id = forms.project_id AND owner_id = auth.uid()));

-- NEWSLETTERS
CREATE POLICY "newsletters: ver do projeto" ON public.newsletters FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.projects WHERE id = newsletters.project_id AND owner_id = auth.uid()));
CREATE POLICY "newsletters: criar" ON public.newsletters FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM public.projects WHERE id = newsletters.project_id AND owner_id = auth.uid()));
CREATE POLICY "newsletters: editar" ON public.newsletters FOR UPDATE
  USING (EXISTS (SELECT 1 FROM public.projects WHERE id = newsletters.project_id AND owner_id = auth.uid()));
CREATE POLICY "newsletters: deletar" ON public.newsletters FOR DELETE
  USING (EXISTS (SELECT 1 FROM public.projects WHERE id = newsletters.project_id AND owner_id = auth.uid()));

-- LANDING PAGES
CREATE POLICY "pages: ver do projeto" ON public.landing_pages FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.projects WHERE id = landing_pages.project_id AND owner_id = auth.uid()));
CREATE POLICY "pages: criar" ON public.landing_pages FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM public.projects WHERE id = landing_pages.project_id AND owner_id = auth.uid()));
CREATE POLICY "pages: editar" ON public.landing_pages FOR UPDATE
  USING (EXISTS (SELECT 1 FROM public.projects WHERE id = landing_pages.project_id AND owner_id = auth.uid()));
CREATE POLICY "pages: deletar" ON public.landing_pages FOR DELETE
  USING (EXISTS (SELECT 1 FROM public.projects WHERE id = landing_pages.project_id AND owner_id = auth.uid()));

-- Landing pages publicadas são públicas (para renderização sem login)
CREATE POLICY "pages: ver publicadas (público)" ON public.landing_pages FOR SELECT
  USING (published = TRUE);

-- ══════════════════════════════════════════════════════════════════════════════
-- SEED: Dados de exemplo para desenvolvimento
-- Comente este bloco em produção
-- ══════════════════════════════════════════════════════════════════════════════

-- Os dados de seed são inseridos automaticamente pelo app no primeiro login.
-- Para inserir manualmente: use o dashboard do Supabase → Table Editor.
