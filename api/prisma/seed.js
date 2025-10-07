
import { PrismaClient } from '@prisma/client';
import fs from 'fs/promises';
import path from 'path';
import url from 'url';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

/* ----------------------------- helpers produtos ---------------------------- */
function numeroOuNull(v) {
  if (v === null || v === undefined || v === '') return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}
function extrairPercentual(v) {
  if (v === null || v === undefined || v === '') return null;
  if (typeof v === 'number') return v;
  const m = String(v).match(/[\d,.]+/);
  if (!m) return null;
  const n = Number(m[0].replace(',', '.'));
  return Number.isFinite(n) ? n : null;
}
function clamp(n, min, max) {
  if (!Number.isFinite(n)) return min;
  return Math.max(min, Math.min(max, n));
}
function arred2(n) {
  return Math.round(n * 100) / 100;
}
function normalizarProduto(p) {
  let discount = extrairPercentual(p.discount);
  if (discount !== null && (discount < 0 || discount > 100)) discount = null;

  let rating = numeroOuNull(p.rating);
  rating = clamp(rating ?? 0, 0, 5);

  let stock = numeroOuNull(p.stock);

  let originalPrice = numeroOuNull(p.originalPrice);
  let price = numeroOuNull(p.price);

  if (originalPrice === null && price !== null) originalPrice = price;
  if (discount !== null && originalPrice !== null) {
    price = arred2(originalPrice * (1 - discount / 100));
  }
  if (price === null && originalPrice !== null) price = originalPrice;

  return {
    imageSrc: String(p.imageSrc || '').trim(),
    title: String(p.title || '').trim(),
    description: String(p.description || '').trim(),
    isNew: Boolean(p.isNew),
    discount: discount,
    rating: rating,
    stock: stock ?? 0,
    originalPrice: originalPrice ?? 0,
    price: price ?? 0,
  };
}

/* --------------------------------- seed ----------------------------------- */
async function main() {
  const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

  // Tente ler do caminho do projeto; se não existir, tenta do /mnt/data (ambiente de execução)
  let filePath = path.resolve(__dirname, './seed/produtos.json');
  try {
    await fs.access(filePath);
  } catch {
    filePath = '/mnt/data/produtos.json';
  }

  // 1) Carregar/normalizar PRODUTOS
  const raw = await fs.readFile(filePath, 'utf-8');
  const items = JSON.parse(raw);
  const produtosData = items.map(normalizarProduto);

  // 2) Limpar tudo (ordem respeitando FKs)
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.favorite.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();

  // 3) Inserir produtos
  await prisma.product.createMany({ data: produtosData });
  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'asc' },
  });
  if (products.length < 6) {
    throw new Error('Preciso de pelo menos 6 produtos para montar itens/favoritos.');
  }

  // Pequenos seletores utilitários
  const p = (i) => products[i % products.length];
  const byTitle = (t) => products.find((x) => x.title === t) ?? products[0];

  // 4) Usuários (6 linhas)
  const plainUsers = [
    { name: 'Ana Souza',    email: 'ana@example.com',    role: 'USER',  password: 'senha123' },
    { name: 'Bruno Lima',   email: 'bruno@example.com',  role: 'USER',  password: 'senha123' },
    { name: 'Carla Alves',  email: 'carla@example.com',  role: 'USER',  password: 'senha123' },
    { name: 'Diego Santos', email: 'diego@example.com',  role: 'USER',  password: 'senha123' },
    { name: 'Eva Ribeiro',  email: 'eva@example.com',    role: 'USER',  password: 'senha123' },
    { name: 'Admin Master', email: 'admin@example.com',  role: 'ADMIN', password: 'admin123' },
  ];

  const users = [];
  for (const u of plainUsers) {
    const passwordHash = await bcrypt.hash(u.password, 10);
    const created = await prisma.user.create({
      data: {
        name: u.name,
        email: u.email,
        role: u.role,
        passwordHash,
      },
    });
    users.push(created);
  }

  // 5) Favoritos (6 linhas)
  const favPairs = [
    [users[0], p(0)],
    [users[1], p(1)],
    [users[2], p(2)],
    [users[3], p(3)],
    [users[4], p(4)],
    [users[0], p(5)], // Ana tem 2 favoritos
  ];
  await prisma.favorite.createMany({
    data: favPairs.map(([u, prod]) => ({
      userId: u.id,
      productId: prod.id,
    })),
    skipDuplicates: true,
  });

  // 6) Carrinhos (6 linhas de Cart; itens logo depois)
  for (let i = 0; i < 6; i++) {
    const user = users[i % users.length];
    const cart = await prisma.cart.create({
      data: { userId: user.id },
    });

    // 1-2 itens por carrinho
    const itens = [
      { cartId: cart.id, productId: p(i).id, quantity: 1 + (i % 2) }, // 1 ou 2
      { cartId: cart.id, productId: p(i + 1).id, quantity: 1 },       // item adicional
    ];
    // evita duplicar produto no mesmo carrinho
    const filtered = itens.filter(
      (it, idx, arr) => arr.findIndex(a => a.productId === it.productId) === idx
    );

    await prisma.cartItem.createMany({ data: filtered });
  }

  // 7) Pedidos (6 linhas) com itens e total
  //    Cada pedido terá 2 itens com snapshots
  for (let i = 0; i < 6; i++) {
    const user = users[i % users.length];
    const prodA = p(i);
    const prodB = p(i + 2);

    const itemsForOrder = [
      {
        productId: prodA.id,
        titleSnapshot: prodA.title,
        priceSnapshot: prodA.price,
        imageSnapshot: prodA.imageSrc,
        quantity: 1 + (i % 2), // 1 ou 2
      },
      {
        productId: prodB.id,
        titleSnapshot: prodB.title,
        priceSnapshot: prodB.price,
        imageSnapshot: prodB.imageSrc,
        quantity: 1,
      },
    ];

    const total = itemsForOrder
      .reduce((acc, it) => acc + it.priceSnapshot * it.quantity, 0);

    await prisma.order.create({
      data: {
        userId: user.id,
        status: (i % 4 === 0) ? 'pago'
              : (i % 4 === 1) ? 'pendente'
              : (i % 4 === 2) ? 'enviado'
              : 'cancelado',
        total: arred2(total),
        items: { create: itemsForOrder },
      },
    });
  }

  // 8) Relatório
  const counts = await Promise.all([
    prisma.user.count(),
    prisma.product.count(),
    prisma.favorite.count(),
    prisma.cart.count(),
    prisma.cartItem.count(),
    prisma.order.count(),
    prisma.orderItem.count(),
  ]);

  console.log(`Seed OK:
  Users:      ${counts[0]}
  Products:   ${counts[1]}
  Favorites:  ${counts[2]}
  Carts:      ${counts[3]}
  CartItems:  ${counts[4]}
  Orders:     ${counts[5]}
  OrderItems: ${counts[6]}
  `);
}

main()
  .catch((e) => {
    console.error('Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
