import { PrismaClient } from '@prisma/client';
import fs from 'fs/promises';
import path from 'path';
import url from 'url';

const prisma = new PrismaClient();

function numeroOuNull(v) {
  if (v === null || v === undefined || v === '') return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function extrairPercentual(v) {
  if (v === null || v === undefined || v === '') return null;
  if (typeof v === 'number') return v;
  const m = String(v).match(/[\d,.]+/); // pega a parte numérica
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
  // Não usaremos o "id" antigo (numérico); Prisma gera um id (cuid) string
  let discount = extrairPercentual(p.discount); // "10%" -> 10
  if (discount !== null) {
    if (discount < 0 || discount > 100) discount = null;
  }

  let rating = numeroOuNull(p.rating);
  rating = clamp(rating ?? 0, 0, 5);

  let stock = numeroOuNull(p.stock);
  // Preços
  let originalPrice = numeroOuNull(p.originalPrice);
  let price = numeroOuNull(p.price);

  if (originalPrice === null && price !== null) {
    // se só veio price, use-o como originalPrice
    originalPrice = price;
  }
  if (discount !== null && originalPrice !== null) {
    // recalcula price a partir do desconto
    price = arred2(originalPrice * (1 - discount / 100));
  }
  // fallback final: se por algum motivo price ainda não existe mas originalPrice sim
  if (price === null && originalPrice !== null) price = originalPrice;

  return {
    // NÃO enviar "id": Prisma vai gerar
    imageSrc: String(p.imageSrc || '').trim(),
    title: String(p.title || '').trim(),
    description: String(p.description || '').trim(),
    isNew: Boolean(p.isNew),
    // isFavorite: Boolean(p.isFavorite),
    discount: discount, // null ou número
    rating: rating,     // 0..5
    stock: stock, 
    originalPrice: originalPrice ?? 0,
    price: price ?? 0
  };
}

async function main() {
  const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
  const filePath = path.resolve(__dirname, './seed/produtos.json');

  const raw = await fs.readFile(filePath, 'utf-8');
  const items = JSON.parse(raw);

  const data = items.map(normalizarProduto);

  // ⚠️ DEV-ONLY: limpa tabela para evitar duplicatas ao reseedar
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.favorite.deleteMany();
  await prisma.product.deleteMany();

  const res = await prisma.product.createMany({ data });
  console.log(`Seed OK: ${res.count} produtos inseridos`);
}

main()
  .catch((e) => {
    console.error('Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
