# 🚀 Guia de Setup do Supabase

## Passo 1: Reativar/Criar Projeto no Supabase

### Se você já tem um projeto (reativar):
1. Vá para [supabase.com](https://supabase.com)
2. Faça login com sua conta
3. Selecione seu projeto existente
4. Copie as credenciais (URL e ANON KEY)

### Se é novo:
1. Vá para [supabase.com](https://supabase.com)
2. Clique em "New Project"
3. Escolha uma region (recomendado: mais próxima de você)
4. Crie um password seguro para o banco
5. Copie as credenciais

---

## Passo 2: Copiar Credenciais

Na dashboard do Supabase:
1. Clique em "Settings" → "API"
2. Copie:
   - **Project URL** → `SUPABASE_URL`
   - **Service Role Key** → `SUPABASE_KEY` (a chave privada, não a anon key)

Seu `.env` deve ficar assim:
```bash
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

⚠️ **IMPORTANTE**: Use a **Service Role Key** (não a ANON KEY) no `.env`

---

## Passo 3: Executar o Schema SQL

### Opção A: Via Supabase Dashboard (Recomendado)
1. Vá para Supabase Dashboard
2. Clique em "SQL Editor" (à esquerda)
3. Clique em "+ New Query"
4. Copie todo o conteúdo de `supabase-schema.sql`
5. Cole no editor
6. Clique em "Run"
7. Espere a confirmação ✅

### Opção B: Via CLI (Se tiver Supabase CLI instalado)
```bash
supabase db push
```

---

## Passo 4: Verificar Criação das Tabelas

Na Supabase Dashboard:
1. Vá para "Table Editor"
2. Você deve ver uma tabela `teams`
3. Clique nela para ver as colunas:
   - `id` (UUID)
   - `user_id` (UUID)
   - `team_name` (text)
   - `author_name` (text)
   - `regulation` (text)
   - `pokemons` (jsonb)
   - `description` (text)
   - `is_public` (boolean)
   - `created_at` (timestamp)
   - `updated_at` (timestamp)

---

## Passo 5: Configurar Autenticação

### Habilitar Email/Password Auth:
1. Vá para "Authentication" → "Providers"
2. Clique em "Email"
3. Toggle "Enabled" para ON
4. Clique "Save"

---

## Passo 6: Testar a Conexão

Rode o projeto localmente:
```bash
npm run dev
```

Tente:
1. Ir para `/signup`
2. Criar uma conta
3. Fazer login
4. Ir para `/team-builder`
5. Salvar um time

Se funcionar, tudo está configurado! ✅

---

## 📊 Estrutura dos Dados

### Tabela `teams`
```sql
teams {
  id: UUID (Primary Key)
  user_id: UUID (Foreign Key → auth.users)
  team_name: text (nome do time)
  author_name: text (nome do treinador)
  regulation: text (VGC, Smogon, Custom)
  pokemons: JSONB (array de pokémons)
  description: text (opcional)
  is_public: boolean (visível no feed?)
  created_at: timestamp
  updated_at: timestamp (auto-atualizado)
}
```

### Estrutura de cada Pokémon (dentro de `pokemons` JSONB)
```json
{
  "pokemon_id": 1,
  "name": "bulbasaur",
  "item": "assault-vest",
  "ability": "overgrow",
  "nature": "Modest",
  "moves": [
    "solar-beam",
    "sludge-bomb",
    "growth",
    "synthesis"
  ]
}
```

---

## 🔒 Segurança (Row Level Security)

O schema já inclui **RLS (Row Level Security)**:

- ✅ Usuários só veem seus próprios times (ou públicos)
- ✅ Usuários só podem criar times se autenticados
- ✅ Usuários só podem editar/deletar seus próprios times
- ✅ Times públicos aparecem para todos (feed)

---

## 🐛 Troubleshooting

### "Erro de conexão ao Supabase"
- Verifique se `SUPABASE_URL` e `SUPABASE_KEY` estão em `.env`
- Verifique se as credenciais estão corretas (sem espaços extras)
- Tente fazer restart do `npm run dev`

### "Table 'teams' not found"
- Volte ao Step 3 e execute o SQL novamente
- Verifique na Supabase Dashboard se a tabela foi criada

### "User not authenticated"
- Verifique se fez login em `/login` antes de tentar salvar
- Verifique se NextAuth está funcionando

### "JSONB parse error"
- Verifique se os pokémons estão sendo passados como array válido
- Veja o console do servidor para mais detalhes

---

## 📝 Queries Úteis (Via Dashboard)

### Ver todos os times públicos
```sql
SELECT id, team_name, author_name, regulation, created_at 
FROM teams 
WHERE is_public = true 
ORDER BY created_at DESC 
LIMIT 20;
```

### Ver times de um usuário específico
```sql
SELECT * FROM teams 
WHERE user_id = 'user-id-aqui' 
ORDER BY created_at DESC;
```

### Contar pokémons por time
```sql
SELECT team_name, jsonb_array_length(pokemons) as pokemon_count 
FROM teams 
WHERE user_id = 'user-id-aqui';
```

### Encontrar times com um pokémon específico
```sql
SELECT team_name, author_name 
FROM teams 
WHERE pokemons @> '[{"name": "pikachu"}]'::jsonb;
```

---

## ✅ Checklist Final

- [ ] Projeto Supabase criado/reativado
- [ ] Credenciais copiadas para `.env`
- [ ] Schema SQL executado
- [ ] Tabela `teams` visível no Table Editor
- [ ] Email/Password Auth habilitado
- [ ] Projeto roda localmente sem erros
- [ ] Consegui fazer signup
- [ ] Consegui fazer login
- [ ] Consegui salvar um time
- [ ] Time aparece no feed se marcado como público

---

## 🚀 Pronto para Produção

Quando estiver tudo funcionando:
1. Faça push das mudanças: `git push`
2. Deploy na Vercel (as variáveis de env já estão configuradas)
3. No painel da Vercel, vá para "Settings" → "Environment Variables"
4. Adicione/confirme:
   - `SUPABASE_URL`
   - `SUPABASE_KEY`
   - Outras vars de produção

---

Qualquer dúvida, estou aqui! 🤝
