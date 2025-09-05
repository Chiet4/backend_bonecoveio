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