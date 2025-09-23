import prisma from '../config/prisma.js';

// Mantém o listar que já enviamos
export async function listarPedidos() {
  return prisma.order.findMany({
    include: {
      items: { include: { product: true } },
      user: { select: { id: true, name: true, email: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
}

/**
 * Atualiza o status de um pedido e retorna o pedido atualizado com relações úteis.
 * @param {string} orderId
 * @param {'pendente'|'pago'|'enviado'|'cancelado'} status
 */
export async function atualizarStatus(orderId, status) {
  // Atualiza e já retorna o pedido com joins que o admin costuma querer ver
  return prisma.order.update({
    where: { id: orderId },
    data: { status },
    include: {
      items: { include: { product: true } },
      user: { select: { id: true, name: true, email: true } },
    },
  });
}
