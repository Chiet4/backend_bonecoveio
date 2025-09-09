import prisma from '../config/prisma.js';
import { paginate } from '../utils/pagination.js';

export async function listarProdutos({ q, isNew, minPrice, maxPrice, page, perPage }) {
  const where = {};

  if (q) {
    where.OR = [
      { title: { contains: q, mode: 'insensitive' } },
      { description: { contains: q, mode: 'insensitive' } },
    ];
  }
  if (typeof isNew === 'boolean') {
    where.isNew = isNew;
  }
  if (minPrice != null || maxPrice != null) {
    where.price = {};
    if (minPrice != null) where.price.gte = minPrice;
    if (maxPrice != null) where.price.lte = maxPrice;
  }

const { skip, take } = paginate({ page, perPage });


  const [items, total] = await Promise.all([
    prisma.product.findMany({
      where,
      skip,
      take,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.product.count({ where }),
  ]);

  return { items, total, page, perPage };
}

/** ADMIN: CRIAR PRODUTO */
export async function criarProduto(data) {
  // segurança adicional
  if (data.discount != null && (data.discount < 0 || data.discount > 100)) {
    const err = new Error('Desconto inválido (0..100)');
    err.status = 422;
    throw err;
  }
  if (data.stock != null && data.stock < 0) {
    const err = new Error('Estoque inválido (>= 0)');
    err.status = 422;
    throw err;
  }

  const created = await prisma.product.create({ data });
  return created;
}

/** ADMIN: ATUALIZAR PRODUTO (parcial) */
export async function atualizarProduto(id, data) {
  // Se precisar recalcular price e não temos originalPrice no body,
  // busque o atual para calcular com o novo discount.
  const needsRecalcPrice =
    Object.prototype.hasOwnProperty.call(data, 'price') === false && // não mande price cru
    (Object.prototype.hasOwnProperty.call(data, 'originalPrice') ||
     Object.prototype.hasOwnProperty.call(data, 'discount'));

  let payload = { ...data };

  if (needsRecalcPrice) {
    const current = await prisma.product.findUnique({
      where: { id },
      select: { originalPrice: true, discount: true },
    });
    if (!current) {
      const err = new Error('Produto não encontrado');
      err.status = 404;
      throw err;
    }
    const originalPrice =
      payload.originalPrice != null ? payload.originalPrice : current.originalPrice;
    const discount =
      payload.discount === null ? undefined :
      payload.discount != null ? payload.discount : current.discount;

    const price =
      discount != null
        ? Number((originalPrice - (originalPrice * discount) / 100).toFixed(2))
        : originalPrice;

    payload = { ...payload, originalPrice, discount, price };
  }

  // Validações simples
  if (payload.discount != null && (payload.discount < 0 || payload.discount > 100)) {
    const err = new Error('Desconto inválido (0..100)');
    err.status = 422;
    throw err;
  }
  if (payload.stock != null && payload.stock < 0) {
    const err = new Error('Estoque inválido (>= 0)');
    err.status = 422;
    throw err;
  }

  try {
    const updated = await prisma.product.update({
      where: { id },
      data: payload,
    });
    return updated;
  } catch (e) {
    // Prisma P2025 = record not found
    if (e.code === 'P2025') {
      const err = new Error('Produto não encontrado');
      err.status = 404;
      throw err;
    }
    throw e;
  }
}

/** ADMIN: REMOVER PRODUTO */
export async function removerProduto(id) {
  try {
    await prisma.product.delete({ where: { id } });
  } catch (e) {
    if (e.code === 'P2025') {
      const err = new Error('Produto não encontrado');
      err.status = 404;
      throw err;
    }
    throw e;
  }
}

/**
 * Busca um produto pelo seu ID.
 * Lança um erro se o produto não for encontrado.
 * @param {string} productId O ID do produto a ser buscado.
 * @returns {Promise<Object>} O objeto do produto encontrado.
 */
export const findById = async (productId) => {
  const product = await prisma.product.findUniqueOrThrow({
    where: {
      id: productId,
    },
  });
  return product;
};
/**
 * Adiciona ou remove um produto dos favoritos de um usuário.
 * @param {string} userId O ID do usuário.
 * @param {string} productId O ID do produto.
 * @returns {Promise<{favorited: boolean}>} Retorna true se o item foi favoritado, false se foi removido.
 */
export const toggleFavorite = async (userId, productId) => {
  // Procura por um favorito que combine o ID do usuário e do produto
  const existingFavorite = await prisma.favorite.findUnique({
    where: {
      userId_productId: { // Usa o índice único definido no schema
        userId,
        productId,
      },
    },
  });

  if (existingFavorite) {
    // Se já existe, remove
    await prisma.favorite.delete({
      where: {
        id: existingFavorite.id,
      },
    });
    return { favorited: false }; // Retorna que foi desfavoritado
  } else {
    // Se não existe, cria
    await prisma.favorite.create({
      data: {
        userId,
        productId,
      },
    });
    return { favorited: true }; // Retorna que foi favoritado
  }
};