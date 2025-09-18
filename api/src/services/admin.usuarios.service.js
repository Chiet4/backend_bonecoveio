import prisma from '../config/prisma.js';
import { paginate } from '../utils/pagination.js';

/**
 * Lista todos os usuários com paginação para a área administrativa.
 * @param {object} paginationOptions Opções de paginação { page, perPage }.
 */
export const listarUsuarios = async ({ page, perPage }) => {
  const { skip, take } = paginate({ page, perPage });

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      skip,
      take,
      select: { // Seleciona apenas os campos seguros para retornar
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.user.count(),
  ]);

  return { items: users, total, page, perPage };
};