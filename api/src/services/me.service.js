import prisma from '../config/prisma.js';
import { paginate } from '../utils/pagination.js';

/**
 * Lista os produtos favoritados por um usuário com paginação.
 * @param {string} userId O ID do usuário.
 * @param {object} paginationOptions Opções de paginação { page, perPage }.
 * @returns {Promise<object>} Um objeto com a lista de produtos, total, página e itens por página.
 */
export const findFavoritesByUserId = async (userId, { page, perPage }) => {
  const where = { userId };
  const { skip, take } = paginate({ page, perPage });

  // Executa as duas consultas em paralelo para mais performance
  const [items, total] = await Promise.all([
    prisma.favorite.findMany({
      where,
      skip,
      take,
      include: {
        product: true, // Inclui os dados do produto
      },
      orderBy: { createdAt: 'desc' }, // Ordena pelos mais recentes
    }),
    prisma.favorite.count({ where }),
  ]);

  return {
    items: items.map(fav => fav.product), // Extrai apenas os dados do produto
    total,
    page,
    perPage,
  };
};