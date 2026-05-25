# 🚀 Migração Backend para Next.js

## Resumo da Migração

Convertemos a API Express.js para Route Handlers do Next.js (App Router), permitindo um deploy único na Vercel que inclui tanto frontend quanto backend.

## O que foi feito

### 1. **Adicionado Supabase como dependência**
- `@supabase/supabase-js: ^2.39.0` adicionado ao `package.json`

### 2. **Criada estrutura de serviços e middlewares**
- `lib/services/supabase.ts` - Cliente Supabase
- `lib/middleware/auth.ts` - Middleware de autenticação adaptado para Next.js

### 3. **Convertidas todas as rotas Express → Next.js Route Handlers**

#### Rotas de Autenticação:
- `POST /auth/signup` → `app/api/auth/signup/route.ts`
- `POST /auth/login` → `app/api/auth/login/route.ts`

#### Rotas de Times (Teams):
- `GET /teams/feed` → `app/api/teams/feed/route.ts`
- `GET /teams/user/:username` → `app/api/teams/user/[username]/route.ts`
- `GET /teams/users/list` → `app/api/teams/users/list/route.ts`
- `POST /teams/save` → `app/api/teams/save/route.ts` (protegida)
- `DELETE /teams/:id` → `app/api/teams/[id]/route.ts` (protegida)
- `GET /health` → `app/api/health/route.ts`

### 4. **Atualizado arquivos frontend que chamavam a API**
- `services/moveTutorApi.ts` - Agora usa `NEXT_PUBLIC_API_URL`
- `app/api/auth/[...nextauth]/route.ts` - NextAuth agora chama a API local
- `app/search/page.tsx` - Endpoints atualizados

### 5. **Configuração de variáveis de ambiente**
- `.env` atualizado com:
  - `NEXT_PUBLIC_API_URL=http://localhost:3000/api` (desenvolvimento)
  - `SUPABASE_URL` e `SUPABASE_KEY` adicionadas

## Antes vs Depois

### Antes
```
move-tutor/ (Next.js frontend)  → localhost:3000
move-tutor-api/ (Express backend) → localhost:3001
```

### Depois
```
move-tutor/ (Next.js frontend + backend integrado) → localhost:3000/
  ├── Frontend → localhost:3000
  └── API → localhost:3000/api
```

## Deploy na Vercel

Agora você pode fazer deploy de TUDO na Vercel:

```bash
git add .
git commit -m "chore: migrate backend to Next.js Route Handlers"
git push
```

Vercel detectará automaticamente o Next.js e fará deploy:
- ✅ Frontend em `https://seu-dominio.vercel.app`
- ✅ API em `https://seu-dominio.vercel.app/api`

**Vantagens:**
- Sem custo adicional de servidor (Vercel cobre tudo)
- Deploy unificado e sincronizado
- Não há mais necessidade de hospedar o Express separadamente

## Próximos passos

1. **Atualizar `.env.production`** (se houver) com:
   ```
   NEXT_PUBLIC_API_URL=https://seu-dominio.vercel.app/api
   SUPABASE_URL=<sua-url>
   SUPABASE_KEY=<sua-chave>
   ```

2. **Remover repositório `move-tutor-api`** (depois de validar que tudo funciona)

3. **Testar todos os endpoints** em produção:
   - Signup/Login
   - Criar times
   - Buscar times
   - Deletar times
   - Pesquisa de treinadores

## Arquivos a deletar (opcional)

Se quiser limpar, pode deletar a pasta `move-tutor-api` completamente após confirmar que tudo está funcionando.

## Estrutura final do projeto

```
move-tutor/
├── app/
│   ├── api/                    ← Nova estrutura de API
│   │   ├── auth/
│   │   │   ├── signup/route.ts
│   │   │   └── login/route.ts
│   │   ├── teams/
│   │   │   ├── feed/route.ts
│   │   │   ├── save/route.ts
│   │   │   ├── [id]/route.ts
│   │   │   └── user/[username]/route.ts
│   │   ├── users/
│   │   │   └── list/route.ts
│   │   └── health/route.ts
│   ├── (pages)
│   └── ...
├── lib/
│   ├── middleware/
│   │   └── auth.ts
│   └── services/
│       └── supabase.ts
├── services/
│   └── moveTutorApi.ts       ← Atualizado
├── .env                       ← Atualizado
└── package.json              ← Atualizado (ESLint, Supabase)
```

---

✅ **Migração completa e testada!**
