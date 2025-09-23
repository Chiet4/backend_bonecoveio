import { Router } from 'express';
import * as adminPedidosController from '../../controllers/admin.pedidos.controller.js';
const router = Router();

// GET /admin/pedidos – listar pedidos
router.get('/', adminPedidosController.listar);


// PATCH /admin/pedidos/:id/status – atualizar status do pedido
router.patch(
  '/:id/status',
  /* auth, authorize('ADMIN'), */
  adminPedidosController.atualizarStatus
);

export default router;
