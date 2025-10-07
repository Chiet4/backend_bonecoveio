# 📘 Documentação da API — E-commerce Boneco Veio

API REST em **Node.js + Express + PostgreSQL + Prisma**.

- **IDs**: `cuid()` (string).
- **Códigos HTTP**:

  - 200 OK, 201 Created, 204 No Content
  - 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found
  - 409 Conflict (ex.: constraint única), 422 Unprocessable Entity (validação)
  - 500 Internal Server Error (genérico)

- **Paginação padrão** (quando aplicável):

  - Query: `?page=1&perPage=12`
  - Resposta:

    ```json
    { "items": [...], "total": 11, "page": 1, "perPage": 12 }
    ```

## Erros (formato padrão)

```json
{
  "message": "Parâmetros inválidos",
  "details": [{ "path": "page", "issue": "deve ser >= 1" }]
}
```

<!-- --- -->

<!-- # 👥 Auth (Público/Usuário)

### POST `/auth/register` — cria usuário

Cria um novo usuário **USER**.

**Body (JSON)**

```json
{
  "name": "João Silva",
  "email": "joao@example.com",
  "password": "Secreta123!"
}
```

**Respostas**

* `201 Created`

```json
{
  "id": "ckx123...",
  "name": "João Silva",
  "email": "joao@example.com",
  "role": "USER",
  "createdAt": "2025-09-03T12:34:56.000Z"
}
```

* `409 Conflict` (email já usado)
* `422 Unprocessable Entity` (validação)

---

### POST `/auth/login` — retorna JWT

Autentica e retorna **accessToken** (e, se usado, **refreshToken**).

**Body**

```json
{ "email": "joao@example.com", "password": "Secreta123!" }
```

**Respostas**

* `200 OK`

```json
{
  "accessToken": "<jwt>",
  "refreshToken": "<jwt-opcional>",
  "user": {
    "id": "ckx123...",
    "name": "João Silva",
    "email": "joao@example.com",
    "role": "USER"
  }
}
```

* `401 Unauthorized` (credenciais inválidas)
* `422` (validação)

---

### GET `/auth/me` — retorna usuário do token

**Headers**

```
Authorization: Bearer <accessToken>
```

**Respostas**

* `200 OK`

```json
{
  "id": "ckx123...",
  "name": "João Silva",
  "email": "joao@example.com",
  "role": "USER",
  "createdAt": "2025-09-03T12:34:56.000Z"
}
```

* `401 Unauthorized` (sem/ruim token)

---

### POST `/auth/refresh` — renova o access token

**Body**

```json
{ "refreshToken": "<jwt>" }
```

**Respostas**

* `200 OK`

```json
{ "accessToken": "<novo-jwt>" }
```

* `401 Unauthorized` (refresh inválido/expirado)
* `422` (validação) -->

<!-- --- -->

# Produtos

### GET `/produtos` — listagem com filtros + paginação

**Query params**

- `q` (string, busca em `title` e `description`)
- `isNew` (`true|false`)
- `minPrice` (number ≥ 0), `maxPrice` (number ≥ 0)
- `page` (int ≥ 1, default 1), `perPage` (int 1..100, default 12)

**Exemplo**

```
GET /produtos?q=cangaceiro&isNew=true&minPrice=189&maxPrice=210&page=1&perPage=12
```

**Resposta — `200 OK`**

```json
{
  "items": [
    {
      "id": "cmf2hu0750000tzxs9qkusmkl",
      "imageSrc": "https://res.cloudinary.com/dad9urjqv/image/upload/v1756812053/3_f6brzu.webp",
      "title": "Cangaceiro - Guerreiros do Sertão",
      "description": "Figura representando os cangaceiros, símbolos da bravura e identidade regional do sertão nordestino.",
      "rating": 5,
      "isNew": true,
      "originalPrice": 210,
      "price": 189,
      "discount": 10,
      "stock": 0,
      "createdAt": "2025-09-02T11:57:10.913Z",
      "updatedAt": "2025-09-02T11:57:10.913Z"
    }
  ],
  "total": 1,
  "page": 1,
  "perPage": 12
}
```

**Erros**

- `422` (page/perPage inválidos, min>max etc.)

---

### GET `/produtos/:id` — detalhe

**Resposta — `200 OK`**

```json
{
  "id": "cmf2hu0750000tzxs9qkusmkl",
  "imageSrc": "https://res.cloudinary.com/dad9urjqv/image/upload/v1756812053/3_f6brzu.webp",
  "title": "Cangaceiro - Guerreiros do Sertão",
  "description": "Figura representando os cangaceiros, símbolos da bravura e identidade regional do sertão nordestino.",
  "rating": 5,
  "isNew": true,
  "originalPrice": 210,
  "price": 189,
  "discount": 10,
  "stock": 0,
  "createdAt": "2025-09-02T11:57:10.913Z",
  "updatedAt": "2025-09-02T11:57:10.913Z"
}
```

- `404 Not Found` (produto inexistente)

---

# Favoritos (por usuário)

### POST `/produtos/:id/favoritos` — toggle (add/remove)

**Headers**

```
Authorization: Bearer <accessToken>
```

**Comportamento**

- Se **não** existe `Favorite(userId, productId)`, cria → **adicionado aos favoritos**.
- Se já existe, deleta → **removido dos favoritos**.

**Respostas**

- `200 OK`

```json
{ "favorited": true } // ou false
```

- `401` (não autenticado), `404` (produto não existe)

---

### GET `/me/favoritos` — lista favoritos do usuário

**Headers**

```
Authorization: Bearer <accessToken>
```

**Resposta — `200 OK`**

```json
{
  "items": [
    {
      "id": "cmf2hu0750000tzxs9qkusmkl",
      "imageSrc": "https://res.cloudinary.com/dad9urjqv/image/upload/v1756812053/3_f6brzu.webp",
      "title": "Cangaceiro - Guerreiros do Sertão",
      "price": 189
    }
  ],
  "total": 1,
  "page": 1,
  "perPage": 50
}
```

---

# Carrinho (do usuário logado)

### GET `/carrinho` — ver itens

**Headers**

```
Authorization: Bearer <accessToken>
```

**Resposta — `200 OK`**

```json
{
  "cartId": "ckc1...",
  "items": [
    {
      "id": "cmf2hu0750000tzxs9qkusmkl",
      "imageSrc": "https://res.cloudinary.com/dad9urjqv/image/upload/v1756812053/3_f6brzu.webp",
      "title": "Cangaceiro - Guerreiros do Sertão",
      "price": 189,
      "quantity": 2
    }
  ],
  "updatedAt": "2025-09-03T12:00:00.000Z"
}
```

- `200` com carrinho vazio: `"items": []`
- `401` (não autenticado)

---

### POST `/carrinho/items` — adicionar item

**Headers**

```
Authorization: Bearer <accessToken>
```

**Body**

```json
{ "produtoId": "ckp1...", "quantidade": 2 }
```

> **Obs.**: o body usa PT-BR (`produtoId`, `quantidade`), mas no banco é `productId`, `quantity`. O controller faz o mapeamento.

**Regras**

- Se o produto já existe no carrinho, **incrementa** a quantidade.
- Quantidade mínima = 1.

**Respostas**

- `201 Created`

```json
{
  "id": "cki1...",
  "productId": "ckp1...",
  "quantity": 2
}
```

- `404` (produto inexistente)
- `422` (quantidade inválida)

---

### PATCH `/carrinho/items/:itemId` — atualizar quantidade

**Headers**

```
Authorization: Bearer <accessToken>
```

**Body**

```json
{ "quantidade": 3 }
```

**Respostas**

- `200 OK`

```json
{
  "id": "cki1...",
  "productId": "ckp1...",
  "quantity": 3
}
```

- `404` (item não encontrado)
- `422` (quantidade inválida)

---

### DELETE `/carrinho/items/:itemId` — remover item

**Headers**

```
Authorization: Bearer <accessToken>
```

**Respostas**

- `204 No Content`
- `404` (item não encontrado)

---

# Pedidos (do usuário logado)

### POST `/pedidos` — checkout (cria pedido a partir do carrinho)

**Headers**

```
Authorization: Bearer <accessToken>
```

**Processo**

- Lê o carrinho do usuário.
- Gera `Order` com `items` **snapshot** (title/price/image do momento da compra).
- Zera o carrinho.
- Status inicial: `pendente`. `total` = soma `priceSnapshot * quantity`.

**Respostas**

- `201 Created`

```json
{
  "id": "ord1...",
  "userId": "cku1...",
  "status": "pendente",
  "total": 179.8,
  "items": [
    {
      "id": "oit1...",
      "productId": "ckp5...",
      "titleSnapshot": "Relogio ...",
      "priceSnapshot": 89.9,
      "imageSnapshot": "https://res.cloudinary.com/dad9urjqv/image/upload/v1756812053/7_f6brzu.webp",
      "quantity": 2
    }
  ],
  "createdAt": "2025-09-03T12:10:00.000Z"
}
```

- `400 Bad Request` (carrinho vazio)
- `401` (não autenticado)

---

### GET `/pedidos` — meus pedidos

**Headers**

```
Authorization: Bearer <accessToken>
```

**Resposta — `200 OK`**

```json
{
  "items": [
    {
      "id": "ord1...",
      "status": "pago",
      "total": 179.8,
      "createdAt": "2025-09-03T12:10:00.000Z"
    }
  ],
  "total": 4,
  "page": 1,
  "perPage": 2
}
```

---

### GET `/pedidos/:id` — detalhe do meu pedido

**Headers**

```
Authorization: Bearer <accessToken>
```

**Resposta — `200 OK`**

```json
{
  "id": "ord1...",
  "status": "pago",
  "total": 179.8,
  "items": [
    {
      "id": "oit1...",
      "productId": "ckp1...",
      "titleSnapshot": "Reologio ...",
      "priceSnapshot": 89.9,
      "imageSnapshot": "https://res.cloudinary.com/dad9urjqv/image/upload/v1756812053/7_f6brzu.webp",
      "quantity": 2
    }
  ],
  "createdAt": "2025-09-03T12:10:00.000Z",
  "updatedAt": "2025-09-03T12:20:00.000Z"
}
```

- `404` (não existe ou não pertence ao usuário logado)

---

# Admin

> Todas exigem `Authorization: Bearer <accessToken>` com `role=ADMIN`.

## Usuários

### GET `/admin/usuarios` — listar

**Query**: `?q=&page=&perPage=`
**Resposta — `200 OK`**

```json
{
  "items": [
    {
      "id": "cku1...",
      "name": "João",
      "email": "joao@example.com",
      "role": "USER",
      "createdAt": "..."
    }
  ],
  "total": 10,
  "page": 1,
  "perPage": 12
}
```

- `401/403` conforme auth/role

---

### PATCH `/admin/usuarios/:id/role` — mudar papel

**Body**

```json
{ "role": "ADMIN" }
```

**Respostas**

- `200 OK`

```json
{ "id": "cku1...", "role": "ADMIN" }
```

- `404` (usuário não encontrado)
- `422` (valor inválido)
- `401/403` (auth/role)

---

### DELETE `/admin/usuarios/:id` — deletar usuário

**Respostas**

- `204 No Content`
- `404` (não encontrado)
- `401/403`

---

## Produtos (Admin)

### GET `/admin/produtos` — visão admin

Mesmo retorno do público, podendo incluindo metadados extras (ex.: `updatedAt`).

**Resposta — `200 OK`**

```json
{
  "items": [
    {
      "id": "ckp1...",
      "title": "Relogio ...",
      "price": 89.9,
      "isNew": true,
      "rating": 4,
      "createdAt": "...",
      "updatedAt": "..."
    }
  ],
  "total": 8,
  "page": 1,
  "perPage": 12
}
```

---

### POST `/admin/produtos` — criar produto

**Body**

```json
{
  "imageSrc": "https://cloudnary.../img1.webp",
  "title": "Relogio Cate...",
  "description": "Na cidade de fortaleza tem um relogio...",
  "originalPrice": 99.9,
  "isNew": true,
  "rating": 4,
  "discount": 10,
  "stock": 0
}
```

> **Regra**: `price` será calculado a partir de `originalPrice` e `discount`.

**Respostas**

- `201 Created`

```json
{
  "id": "ckp3d3...",
  "imageSrc": "https://cloudnary.../img1.webp",
  "title": "Relogio Cate...",
  "description": "Na cidade de fortaleza tem um relogio...",
  "rating": 4,
  "isNew": true,
  "originalPrice": 99.9,
  "price": 89.91,
  "discount": 10,
  "stock": 0,
  "createdAt": "...",
  "updatedAt": "..."
}
```

- `422` (validação)
- `401/403` (auth/role)

---

### PATCH `/admin/produtos/:id` — editar produto

**Body** (parcial)

```json
{
  "discount": 15,
  "isNew": false
}
```

> **Regra**: se `originalPrice` ou `discount` mudarem, recalcular `price`.

**Respostas**

- `200 OK` (JSON do produto atualizado)
- `404` (não encontrado), `422` (validação), `401/403`

---

### DELETE `/admin/produtos/:id` — remover produto

**Respostas**

- `204 No Content`
- `404` (não encontrado), `401/403`

---

## Pedidos (Admin)

### GET `/admin/pedidos` — todos os pedidos

**Query**: `?status=pago&from=2025-09-01&to=2025-09-30&page=1&perPage=20`

**Resposta — `200 OK`**

```json
{
  "items": [
    {
      "id": "ord1...",
      "userId": "cku1...",
      "status": "pago",
      "total": 179.8,
      "createdAt": "2025-09-03T12:10:00.000Z"
    }
  ],
  "total": 5,
  "page": 1,
  "perPage": 20
}
```

---

### PATCH `/admin/pedidos/:id/status` — alterar status

**Body**

```json
{ "status": "enviado" }
```

> **Enum válido**: `"pendente" | "pago" | "enviado" | "cancelado"`

**Respostas**

- `200 OK`

```json
{ "id": "ord1...", "status": "enviado" }
```

- `404` (pedido inexistente), `422` (status inválido), `401/403`


---
