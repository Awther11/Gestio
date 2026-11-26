# API de Produtos e Usuários

API REST desenvolvida em Node.js e TypeScript para autenticação de usuários e gerenciamento de produtos, integrada a um banco PostgreSQL existente no Supabase.

## Tecnologias

* **Runtime & Linguagem:** Node.js, TypeScript
* **Framework:** Express 4
* **Banco de Dados & ORM:** PostgreSQL (Supabase), Prisma 6
* **Validação & Segurança:** Zod, JWT (JSON Web Token), CORS

---

## Configuração do Ambiente

1. Clone o repositório e instale as dependências:
   ```bash
   npm install
   ```

2. Crie um arquivo `.env` na raiz do projeto baseado no `.env.example`:
   ```bash
   cp .env.example .env
   ```

3. Preencha as variáveis no `.env` com as credenciais do seu projeto no Supabase e uma chave secreta para o JWT:
   ```env
   PORT=3333
   NODE_ENV=development

   DATABASE_URL="postgresql://postgres.SEU_REF:SUA_SENHA@aws-0-SUA_[REGIAO.pooler.supabase.com:6543/postgres?pgbouncer=true](https://REGIAO.pooler.supabase.com:6543/postgres?pgbouncer=true)"
   DIRECT_URL="postgresql://postgres.SEU_REF:SUA_SENHA@aws-0-SUA_[REGIAO.pooler.supabase.com:5432/postgres](https://REGIAO.pooler.supabase.com:5432/postgres)"

   JWT_SECRET="sua-chave-secreta-aleatoria"
   JWT_EXPIRES_IN="1d"
   ```

---

## Banco de Dados e Execução

> **Atenção:** Como este projeto utiliza um banco de dados já existente no Supabase, **não utilize `npx prisma migrate dev`**. Utilize `db push` para sincronizar o schema sem apagar os dados existentes.

1. Sincronize o schema com o banco e gere o Prisma Client:
   ```bash
   npx prisma db push
   npx prisma generate
   ```

2. No **SQL Editor** do painel do Supabase, habilite o Row Level Security (RLS) na tabela criada:
   ```sql
   alter table public.usuarios_api enable row level security;
   ```

3. Inicie o servidor em modo de desenvolvimento:
   ```bash
   npm run dev
   ```
   O servidor estará disponível em `http://localhost:3333` (ou na porta definida no `.env`).