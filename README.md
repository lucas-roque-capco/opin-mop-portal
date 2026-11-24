# opin-mop-portal

Portal leve (Next.js 15 + MUI 6) com **uma tela** de listagem dos erros do MOP Server.

Identidade visual alinhada ao `opin-portal-frontend` (Open Insurance: verde `#8CD23F` / `#193F12`, Roboto + Blogger Sans).

## Pré-requisitos

1. Entrypoint do MOP na porta **3000**. Ele consulta o serviço de erros por dentro; essa porta não é publicada.

```bash
cd ../opin-mop-server
docker compose -f docker-compose.local.yml up --build entrypoint-service errors-service
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
| `MOP_ENTRYPOINT_URL` | Base do entrypoint (default `http://localhost:3000`) |

O browser não chama o MOP. Os BFFs `/api/errors/mop`, `/api/errors/participant` e `/api/errors/participant/summary` repassam a query para o entrypoint.

## Scripts

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Desenvolvimento |
| `npm run build` | Build de produção |
| `npm start` | Sobe o build |
| `npm run typecheck` | `tsc --noEmit` |
