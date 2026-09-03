# ZeGrana

Aplicação de finanças pessoais criada com Angular, Express e PostgreSQL. A experiência é mobile-first e os layouts seguem a referência visual em `Design-telas/`.

## Rodar localmente

1. Garanta que um servidor PostgreSQL esteja em execução e crie um banco vazio chamado `zegrana` (ou ajuste a URL).
2. Copie `.env.example` para `.env`, preencha `DATABASE_URL` e defina um `SESSION_SECRET` longo e aleatório.
3. Instale as dependências com `npm install`.
4. Execute `npm run dev`.

O cliente fica em `http://localhost:4200` e a API em `http://localhost:3000/api`.

As migrations são executadas automaticamente ao iniciar a API. Também podem ser executadas isoladamente com `npm run db:migrate`.

## Arquitetura

- `frontend/src/app/core`: sessão, guard, interceptor e serviços HTTP.
- `frontend/src/app/shared`: navegação e componentes reutilizáveis.
- `frontend/src/app/features`: landing, autenticação, dashboard e finanças.
- `backend/src/dominio`, `aplicacao`, `infraestrutura`, `apresentacao` e `composicao`: separação entre contratos, casos de uso, Postgres, HTTP e injeção de dependências.

As rotas da API exigem sessão autenticada, exceto `POST /api/auth/register` e `POST /api/auth/login`. A sessão usa cookie HTTP-only; não há token persistido no navegador.
