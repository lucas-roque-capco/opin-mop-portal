# opin-mop-portal

Portal leve (Next.js 15 + MUI 6) com **uma tela** de listagem dos erros do MOP Server.

Identidade visual alinhada ao `opin-portal-frontend` (Open Insurance: verde `#8CD23F` / `#193F12`, Roboto + Blogger Sans).

## Pré-requisitos

1. Microserviço de erros rodando na porta **3010**:

```bash
cd ../opin-mop-server
docker compose -f docker-compose.local.yml up --build errors-service
# ou: npm run start:open-insurance-mop-server-errors
```

2. Node 20+.

## Setup

```bash
cp .env.example .env
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

## Variáveis de ambiente

| Variável | Descrição |
|----------|-----------|
| `MOP_ERRORS_API_URL` | Base URL do `mop-server-errors` (default `http://localhost:3010`) |
| `MOP_ERRORS_API_KEY` | Valor do header `X-MOP-API-Key` (só no servidor Next — BFF `/api/errors`) |

O browser **nunca** chama o errors-service diretamente; usa `/api/errors` como proxy.

## Scripts

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Desenvolvimento |
| `npm run build` | Build de produção |
| `npm start` | Sobe o build |
| `npm run typecheck` | `tsc --noEmit` |
