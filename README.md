# E-commerce Boneco Veio (Admin + Usuário) — Back-end

Projeto Backend API desenvolvido em Node.js + Express + PostgreSQL + Prisma.

## Sumário
- [Arquitetura de Pastas](#arquitetura-de-pastas)
- [O que vai em cada pasta](#o-que-vai-em-cada-pasta)
- [Regras de Ouro](#regras-de-ouro-)
- [Fluxo de uma Requisição](#fluxo-de-uma-requisição)
- [Rotas (Resumo)](#rotas)
- [Padrões de Commits](#padrão-de-commits)

---

## Arquitetura de Pastas

```
backend_bonecoveio/
  ├─ README.md
  └─ api/
      ├─ .env                   # Variáveis de ambiente (conexão com banco, JWT, porta etc.)
      ├─ package.json           # Dependências e scripts npm
      ├─ prisma/                # Schema e migrações do banco (Prisma)
      │  ├─ schema.prisma
      │  └─ migrations/
      └─ src/                   # Código-fonte da API
        ├─ app.js               # Configuração base do Express (middlewares, rotas, erros)
        ├─ server.js            # Inicialização do servidor (app.listen)
        ├─ config/              # Configurações e instâncias únicas (ex.: PrismaClient)
        ├─ middlewares/         # Funções que interceptam requisições (auth, errors, etc.)
        ├─ routes/              # Definição dos endpoints (público e admin)
        ├─ controllers/         # Traduzem req/res e chamam os services
        ├─ services/            # Regras de negócio e acesso ao banco (via Prisma)
        ├─ domain/              # DTOs e validações de entrada/saída (ex.: zod schemas??)
        └─ utils/               # Funções utilitárias (JWT, hash de senha, paginação, etc.)

```

## O que vai em cada pasta
- `prisma/`
  - Contém o schema.prisma (modelos do banco) e as migrações automáticas.
  - Onde definimos entidades como `User`, `Product`, `Order`.

- `config/`
  - Instâncias e configurações globais.
  - Exemplo: `prisma.js` com um único `PrismaClient`.

- `middlewares/`
  - Funções que rodam entre a requisição e o `controller`.
  - Exemplos: autenticação JWT, verificação de `role admin`, tratamento de erros.

- `routes/`
  - Arquivos que definem os endpoints (GET `/produtos`, POST `/auth/login`).
  - Só mapeiam caminhos para funções do `controller`.

- `controllers/`
  - Camada que lida com HTTP: recebe `req`, chama o `service` e devolve `res.json(...)`.
  - Exemplo: `productController.listarProdutos(req, res)`.

- `services/`
  - Onde fica a regra de negócio e o acesso ao banco via Prisma.
  - Exemplo: `productService.listarProdutos(filtros)`.

- `domain/` - *decidir ainda se vamos usar* 
  - Define contratos e validações (schemas do Zod, DTOs).
  - Exemplo: `createProductSchema`, `updateUserSchema`.

- `utils/`
  - Funções auxiliares independentes.
  - Exemplo: `jwt.sign/verify`, `generateToken`.

## Regras de Ouro 🚨

1 - Rota curta, `Controller` fino, `Service` gordo
- Rota só chama `controller`.
- `Controller` só traduz HTTP.
- `Service` resolve a regra de negócio.

2 - Nada de Prisma direto no `Controller`
- `Controller` → chama `Service` → `Service` usa Prisma.
- Facilita testes e mantém responsabilidades separadas.

3 - (Decidir ainda se vamos usar) Validação em `domain/`
- Use zod para validar `req.body/params/query`.
- `Controller` só chama o schema e repassa dados já validados.

4 - Erros padronizados
- Sempre lançar erros com `{ status, message }`.
- `Middleware` `error.js` centraliza resposta ao cliente.

5 - Consistência nos nomes
- Rotas em português (`/produtos`, `/pedidos`).
- Campos do banco em inglês (`productId, createdAt`).
- Mapeamento feito no domain/ quando necessário.

## Fluxo de uma Requisição

1 - Rota: GET `/produtos` é definida em `routes/produtos.routes.js`.

2 - `Controller`: recebe `req.query`, chama `productService.listar(...)`.

3 - `Service`: aplica regras de negócio, consulta Prisma (`prisma.product.findMany`).

4 - `Domain`: valida entrada e saída com schemas (Como não foi decidido, validado direto no código).

5 - `Controller`: envia `res.json(...)`.

6 - `Middleware` de erro (se algo falhar): devolve resposta padrão.


## Rotas
```
- Público/Usuário
  - `POST /auth/register` – cria usuário
  - `POST  /auth/login` – retorna JWT
  - `GET /auth/me` – retorna usuário do token (front)
  - `POST /auth/refresh` - refresh dos tokens.

- Produtos
  - `GET /produtos` – lista com filtros 
  - `GET /produtos/:id` – detalhe

- Favorito (por usuário):
  - `POST /produtos/:id/favoritos` – adiciona/remove dos favoritos do usuário
  - `GET /me/favoritos` – lista favoritos do usuário

- Carrinho (do usuário logado)
  - `GET /carrinho` – ver itens do carrinho
  - `POST /carrinho/items` – { produtoId, quantidade }
  - `PATCH /carrinho/items/:itemId` – { quantidade }
  - `DELETE /carrinho/items/:itemId`

- Pedidos (do usuário logado)
  - `POST /pedidos` – cria pedido a partir do carrinho (checkout)
  - `GET /pedidos` – lista meus pedidos
  - `GET /pedidos/:id` – detalhe do meu pedido

- Admin
    - Usuários
      - `GET /admin/usuarios` – listar com usuários
      - `PATCH /admin/usuarios/:id/role` – { `role: "ADMIN"|"USER"` }
      - `DELETE /admin/usuarios/:id` - deleta usuário

    - Produtos
      - `GET /admin/produtos` – visão admin (pode reutilizar a pública com campos diferentes)
      - `POST /admin/produtos` – criar
      - `PATCH /admin/produtos/:id` – editar
      - `DELETE/admin/produtos/:id` – remover

    - Pedidos
      - `GET /admin/pedidos` – todos os pedidos 
      - `PATCH /admin/pedidos/:id/status` – { `status: "pendente" | "Enviado" |"pago"|"cancelado"` }
```

## Padrão de commits
- Utilizamos o padrão: [iuricode/padroes-de-commits](https://github.com/iuricode/padroes-de-commits)

## Comandos inciais 

```bash 
# 1) Clonar e entrar no projeto
git clone <url-do-repo>
cd backend_bonecoveio/api

# 2) Instalar dependências
npm install

# 3) Configurar variáveis de ambiente
touch .env  
# abra o arquivo e ajuste a DATABASE_URL com seu Postgres

# 4) Inicializar Prisma (só na 1ª vez)
npm run prisma:init    # cria arquivos base do Prisma

# 5) Gerar client do Prisma
npm run db:gen

# 6) Criar/rodar migrações no banco (dev)
npm run db:migrate

# (opcional) Abrir Prisma Studio (GUI para ver os dados)
npm run prisma:studio

# 7) Subir o servidor em modo desenvolvimento (com nodemon)
npm run dev

```

<div>
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
</div>