import * as adminPedidosService from '../services/admin.pedidos.service.js';
import { Prisma } from '@prisma/client';

const VALID_STATUSES = ['pendente', 'pago', 'enviado', 'cancelado'];

/**
 * GET /admin/pedidos
 */
export const listar = async (_req, res, next) => {
  try {
    const pedidos = await adminPedidosService.listarPedidos();
    res.status(200).json(pedidos);
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /admin/pedidos/:id/status
 * body: { status: 'pendente'|'pago'|'enviado'|'cancelado' }
 */
export const atualizarStatus = async (req, res, next) => {
  try {
    const { status } = req.body || {};
    if (!VALID_STATUSES.includes(status)) {
      return res.status(400).json({
        error: { message: `Status inválido. Use um de: ${VALID_STATUSES.join(', ')}` },
      });
    }

    const pedidoAtualizado = await adminPedidosService.atualizarStatus(req.params.id, status);
    return res.status(200).json(pedidoAtualizado);
  } catch (error) {
    // Se não encontrar: Prisma P2025
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      error.status = 404;
      error.message = 'Pedido não encontrado';
    }
    next(error);
  }
};
