# E-commerce Boneco Veio (Admin + Usuário) — Back-end

API em Node.js + Express + PostgreSQL + Prisma.

## Sumário
- [Arquitetura de Pastas](#arquitetura-de-pastas)
- [Rotas (Resumo)](#rotas-resumo)

---

## Arquitetura de Pastas

```
backend_bonecoveio/
  ├─ README.md
  ├─ api/                 
  │  ├─ .env.example
  │  ├─ package.json
  │  ├─ prisma/
  │  │  ├─ schema.prisma
  │  │  └─ migrations/
  │  └─ src/
  │     ├─ app.ts         # instancia do express + middlewares
  │     ├─ server.ts      # sobe servidor
  │     ├─ config/
  │     │  └─ prisma.ts   # PrismaClient 
  │     ├─ middlewares/   # Funções "pipeline" entre as requisições e respostas
  │     │  └─ auth.js     # valida JWT
  │     ├─ routes/
  │     │  ├─ public/     # /auth, /produtos, /carrinho, /pedidos
  │     │  └─ admin/      # /admin/usuarios, /admin/produtos, /admin/pedidos
  │     ├─ controllers/   # req/res mínimo
  │     ├─ services/      # regra de negócio
  │     ├─ domain/        # DTOs/validações de entrada e saída 
  │     └─ utils/         # jwt, password, pagination
```


### ROTAS

- Público/Usuário
  - POST /auth/register – cria usuário
  - POST /auth/login – retorna JWT
  - GET /auth/me – retorna usuário do token (front)
  - POST /auth/refresh - refresh dos tokens.

- Produtos
  - GET /produtos – lista com filtros 
  - GET /produtos/:id – detalhe

- Favorito (por usuário):
  - POST /produtos/:id/favoritos – adiciona/remove dos favoritos do usuário
  - GET /me/favoritos – lista favoritos do usuário

- Carrinho (do usuário logado)
  - GET /carrinho – ver itens do carrinho
  - POST /carrinho/items – { produtoId, quantidade }
  - PATCH /carrinho/items/:itemId – { quantidade }
  - DELETE /carrinho/items/:itemId

- Pedidos (do usuário logado)
  - POST /pedidos – cria pedido a partir do carrinho (checkout)
  - GET /pedidos – lista meus pedidos
  - GET /pedidos/:id – detalhe do meu pedido

- Admin
    - Usuários
      - GET /admin/usuarios – listar com usuários
      - PATCH /admin/usuarios/:id/role – { role: "ADMIN"|"USER" }
      - DELETE /admin/usuarios/:id

    - Produtos
      - GET /admin/produtos – visão admin (pode reutilizar a pública com campos diferentes)
      - POST /admin/produtos – criar
      - PATCH /admin/produtos/:id – editar
      - DELETE/admin/produtos/:id – remover

    - Pedidos
      - GET /admin/pedidos – todos os pedidos 
      - PATCH /admin/pedidos/:id/status – { status: "pendente" | "Enviado" |"pago"|"cancelado" }

