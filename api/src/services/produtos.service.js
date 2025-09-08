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