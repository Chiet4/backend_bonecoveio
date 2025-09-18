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
/**
 * Busca um usuário pelo seu ID para a área administrativa.
 * Lança um erro se o usuário não for encontrado.
 * @param {string} userId O ID do usuário a ser buscado.
 * @returns {Promise<Object>} O objeto do usuário encontrado.
 */
export const findUserById = async (userId) => {
  const user = await prisma.user.findUniqueOrThrow({
    where: {
      id: userId,
    },
    select: { 
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });
  return user;
};
