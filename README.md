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















</div>
<h2>🔷 Autores:</h2>
<div>
  <table>
    <tr>
      <td align="center">
        <a href="https://github.com/Chiet4" >
          <img src="https://avatars.githubusercontent.com/u/111232477?v=4" alt="Anchieta Albano"
            width="100px" >
          <br>
          <sub><b>Anchieta Albano</b></sub>
        </a>
      </td>
      <td align="center">
        <a href="https://github.com/davidwferreira">
          <img src="https://avatars.githubusercontent.com/u/203657092?v=4" alt="David Ferreira"
            width="100px" />
          <br />
          <sub><b>David Ferreira</b></sub>
        </a>
      </td>
      <td align="center">
          <a href="https://github.com/meliszalee">
            <img src="https://avatars.githubusercontent.com/u/167802044?v=4" alt="Melissa Lee"
             width="100px"/>
            <br />
            <sub><b>Melissa Lee</b></sub>
          </a>
      </td>
      <td align="center">
          <a href="https://github.com/DaniCrisCastro">
            <img src="https://avatars.githubusercontent.com/u/145491691?v=4" alt="Danielle Castro"
             width="100px" />
            <br />
            <sub><b>Danielle Castro</b></sub>
          </a>
      </td>
      </td>
      <td align="center">
          <a href="https://github.com/thaynaxt">
            <img src="https://avatars.githubusercontent.com/u/125219765?v=4" alt="Thayná Albano"
             width="100px" />
            <br />
            <sub><b>Thayná Albano</b></sub>
          </a>
      </td>
    </tr>
    <td align="center">
          <a href="https://github.com/wullerbarros">
            <img src="https://avatars.githubusercontent.com/u/105557727?v=4" alt="Wüller Barros"
             width="100px" />
            <br />
            <sub><b>Wüller Barros</b></sub>
          </a>
      </td>
  </table>
</div>