# ClubeCRM — Guia de Deploy Completo
## GitHub → Supabase → Vercel

---

## Visão geral

```
Você (código local)
    ↓  git push
GitHub (repositório)
    ↓  deploy automático
Vercel (frontend + API)
    ↓  autenticação + banco
Supabase (auth + PostgreSQL)
    ↓  envio de e-mails
Resend (SMTP transacional)
```

Tempo estimado: **30–45 minutos** na primeira vez.

---

## ETAPA 1 — Preparar o repositório no GitHub

### 1.1 Criar conta no GitHub
Acesse https://github.com e crie uma conta gratuita se ainda não tiver.

### 1.2 Criar repositório
1. Clique em **"New repository"**
2. Nome: `clubecrm`
3. Visibilidade: **Private** (recomendado para projeto beta)
4. **Não** marque "Add README" — o projeto já tem tudo
5. Clique em **"Create repository"**

### 1.3 Fazer upload do projeto

Instale o Git se não tiver: https://git-scm.com

No terminal, dentro da pasta do projeto:

```bash
# Inicializar repositório local
git init

# Adicionar todos os arquivos (o .gitignore já exclui node_modules e .env)
git add .

# Primeiro commit
git commit -m "feat: ClubeCRM v1.0 - beta"

# Conectar ao GitHub (substitua SEU_USUARIO pelo seu usuário do GitHub)
git remote add origin https://github.com/SEU_USUARIO/clubecrm.git

# Enviar para o GitHub
git branch -M main
git push -u origin main
```

Após isso, atualize a página do GitHub — todos os arquivos devem aparecer.

---

## ETAPA 2 — Configurar o Supabase

### 2.1 Criar projeto
1. Acesse https://supabase.com e faça login (conta gratuita)
2. Clique em **"New project"**
3. Preencha:
   - **Name:** `clubecrm`
   - **Database Password:** crie uma senha forte e **salve em local seguro**
   - **Region:** `South America (São Paulo)` — mais rápido para usuários BR
4. Clique em **"Create new project"** e aguarde ~2 minutos

### 2.2 Executar o schema SQL
1. No painel do Supabase, vá em **SQL Editor** → **New query**
2. Abra o arquivo `supabase/schema.sql` do projeto
3. Copie todo o conteúdo e cole no editor
4. Clique em **"Run"** (botão verde)
5. Deve aparecer "Success. No rows returned"

### 2.3 Configurar autenticação
1. Vá em **Authentication** → **Providers**
2. **Email** já vem habilitado por padrão — confirme que está ativo
3. Vá em **Authentication** → **URL Configuration**
4. Em **Site URL**, coloque: `https://clubecrm.vercel.app` (ajuste depois do deploy)
5. Em **Redirect URLs**, adicione:
   ```
   https://clubecrm.vercel.app/auth/reset-password
   https://clubecrm.vercel.app/**
   http://localhost:3000/**
   ```
6. Clique em **Save**

### 2.4 Configurar template de e-mail do Supabase
1. Vá em **Authentication** → **Email Templates**
2. Em **Reset Password**, substitua o conteúdo por:
   ```html
   <h2>Recuperar senha — ClubeCRM</h2>
   <p>Clique no link abaixo para criar uma nova senha:</p>
   <p><a href="{{ .ConfirmationURL }}">Criar nova senha →</a></p>
   <p>O link expira em 1 hora.</p>
   ```
3. Clique em **Save**

### 2.5 Pegar as chaves de API
1. Vá em **Settings** → **API**
2. Copie e salve:
   - **Project URL** → será o `NEXT_PUBLIC_SUPABASE_URL`
   - **anon (public)** → será o `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role (secret)** → será o `SUPABASE_SERVICE_ROLE_KEY`
   
   ⚠️ A `service_role` é secreta — nunca exponha no frontend.

---

## ETAPA 3 — Configurar o Resend (envio de e-mail)

### 3.1 Criar conta
Acesse https://resend.com → **"Get Started"** → crie conta gratuita.
O plano gratuito inclui 3.000 e-mails/mês — suficiente para o beta.

### 3.2 Verificar domínio
1. Vá em **Domains** → **Add Domain**
2. Digite seu domínio (ex: `clubecrm.com.br` ou o domínio que você tiver)
3. O Resend vai mostrar 3 registros DNS para adicionar:
   - **SPF** (tipo TXT)
   - **DKIM** (tipo CNAME — 2 registros)
4. Acesse o painel do seu provedor de domínio (Registro.br, GoDaddy, etc)
5. Adicione os 3 registros
6. Volte ao Resend e clique **"Verify DNS records"**
7. Aguarde até 24h — geralmente leva menos de 1h

### 3.3 Criar API Key
1. Vá em **API Keys** → **Create API Key**
2. Nome: `clubecrm-production`
3. Permission: **Sending access**
4. Copie a chave (começa com `re_`) — **ela só aparece uma vez**

> Se ainda não tiver domínio próprio: use o domínio de teste do Resend
> (`onboarding@resend.dev`) — suficiente para validar o beta.

---

## ETAPA 4 — Deploy na Vercel

### 4.1 Criar conta
Acesse https://vercel.com → **"Sign Up"** → faça login com o GitHub.
Isso conecta automaticamente seus repositórios.

### 4.2 Importar o projeto
1. No dashboard da Vercel, clique em **"Add New Project"**
2. Selecione o repositório `clubecrm` do GitHub
3. Clique em **"Import"**

### 4.3 Configurar variáveis de ambiente
Antes de fazer o deploy, configure as variáveis. Clique em **"Environment Variables"** e adicione uma por vez:

| Nome | Valor | Onde pegar |
|------|-------|-----------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xxx.supabase.co` | Supabase → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJ...` | Supabase → Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJ...` | Supabase → Settings → API |
| `RESEND_API_KEY` | `re_...` | Resend → API Keys |
| `RESEND_FROM_EMAIL` | `contato@seudominio.com` | Seu domínio verificado |
| `RESEND_FROM_NAME` | `ClubeCRM` | Livre |
| `NEXT_PUBLIC_APP_URL` | `https://clubecrm.vercel.app` | URL do seu app (ajuste após deploy) |
| `APP_SECRET` | (string aleatória 32+ chars) | Gere em: https://generate-secret.vercel.app/32 |

### 4.4 Fazer o deploy
1. Clique em **"Deploy"**
2. Aguarde 2–3 minutos — você verá o build em tempo real
3. Quando terminar, aparecerá ✅ e a URL do app (ex: `clubecrm.vercel.app`)

### 4.5 Atualizar URL no Supabase
1. Copie a URL gerada pela Vercel
2. Volte ao Supabase → **Authentication** → **URL Configuration**
3. Atualize o **Site URL** com a URL real
4. Adicione também em **Redirect URLs** se ainda não estiver

---

## ETAPA 5 — Testar tudo

### Checklist de validação

**Autenticação**
- [ ] Acessar `https://clubecrm.vercel.app` redireciona para `/auth/login`
- [ ] Criar conta com e-mail e senha funciona
- [ ] Login com as credenciais funciona
- [ ] "Esqueci minha senha" envia e-mail (verifique caixa de entrada)
- [ ] Link do e-mail redireciona para `/auth/reset-password`
- [ ] Nova senha é salva e login funciona

**CRM**
- [ ] Criar projeto aparece na sidebar
- [ ] Leads são criados e aparecem na tabela
- [ ] Drag & drop no kanban move leads entre etapas
- [ ] Importar CSV com leads funciona
- [ ] Exportar CSV baixa arquivo correto

**E-mail**
- [ ] Testar envio dispara e-mail real para o endereço digitado
- [ ] Painel de saúde mostra registros DNS

**Landing Pages**
- [ ] Criar página com template funciona
- [ ] Editor abre com preview
- [ ] Publicar gera URL pública

---

## ETAPA 6 — Domínio personalizado (opcional)

Para usar `app.seudominio.com.br` em vez de `clubecrm.vercel.app`:

1. Na Vercel → seu projeto → **Settings** → **Domains**
2. Clique em **"Add"** e digite o domínio desejado
3. A Vercel mostrará um registro DNS para adicionar no seu provedor
4. Adicione o registro e aguarde propagação (5–30 min)
5. Atualize `NEXT_PUBLIC_APP_URL` nas variáveis da Vercel com o novo domínio
6. Atualize as URLs no Supabase também

---

## Deploy contínuo (automático)

A partir de agora, todo `git push` para a branch `main` dispara um novo deploy automaticamente na Vercel. Fluxo de trabalho recomendado:

```bash
# Desenvolver localmente
npm run dev

# Testar
npm run build

# Publicar
git add .
git commit -m "feat: descrição da mudança"
git push origin main
# → Vercel detecta o push e faz o deploy automaticamente
```

---

## Estrutura de arquivos final

```
clubecrm/
├── app/
│   ├── auth/
│   │   ├── login/page.tsx          ← Tela de login
│   │   ├── register/page.tsx       ← Cadastro
│   │   ├── forgot-password/page.tsx← Esqueci senha
│   │   └── reset-password/page.tsx ← Redefinir senha
│   ├── dashboard/
│   │   └── page.tsx                ← Dashboard principal
│   ├── api/
│   │   ├── projects/route.ts       ← CRUD projetos
│   │   ├── leads/
│   │   │   ├── route.ts            ← CRUD leads
│   │   │   └── import/route.ts     ← Importação CSV
│   │   ├── newsletters/route.ts    ← CRUD newsletters
│   │   ├── email/test/route.ts     ← Teste de envio
│   │   └── public/form/route.ts    ← Submissão pública
│   ├── layout.tsx                  ← Layout raiz
│   └── globals.css
├── lib/
│   ├── supabase/
│   │   ├── client.ts               ← Client browser
│   │   └── server.ts               ← Client server + admin
│   └── resend.ts                   ← Templates de e-mail
├── types/
│   └── database.ts                 ← Tipos do Supabase
├── supabase/
│   └── schema.sql                  ← Schema completo do banco
├── middleware.ts                   ← Proteção de rotas
├── next.config.js
├── tsconfig.json
├── vercel.json                     ← Config de deploy
├── .env.example                    ← Modelo de variáveis
├── .gitignore
└── package.json
```

---

## Custos estimados para o beta

| Serviço | Plano | Custo |
|---------|-------|-------|
| Vercel | Hobby | Gratuito |
| Supabase | Free | Gratuito (500MB banco, 50k usuários) |
| Resend | Free | Gratuito (3.000 e-mails/mês) |
| GitHub | Free | Gratuito |
| **Total** | | **R$ 0/mês** |

Quando escalar para produção com volume maior:
| Serviço | Plano Pago | Custo |
|---------|-----------|-------|
| Vercel Pro | USD 20/mês |
| Supabase Pro | USD 25/mês |
| Resend | USD 20/mês (50k e-mails) |
| **Total** | **≈ R$ 350/mês** |

---

## Suporte e próximos passos

Após o beta validado com investidores, os próximos itens de roadmap são:

1. **OAuth** — Login com Google e LinkedIn (1 dia de implementação)
2. **Multi-usuário** — Convidar membros da equipe por projeto
3. **Planos e cobrança** — Integração Stripe para monetização
4. **App mobile** — Versão React Native do painel
5. **Webhooks** — Integração com Zapier, Make e n8n
6. **IP dedicado** — Para escalar o volume de e-mails sem risco de reputação

---

*Guia gerado automaticamente pelo ClubeCRM — versão beta 1.0*
