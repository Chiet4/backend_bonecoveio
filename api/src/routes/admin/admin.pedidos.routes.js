import { Router } from 'express';
const router = Router();

// GET /admin/pedidos – todos os pedidos ?status=&from=&to=&page=&perPage=
router.get('/', (req, res) => {
  return res.status(501).json({ message: 'Não implementado (admin: listar pedidos)' });
});

// PATCH /admin/pedidos/:id/status – { status: "pendente"|"pago"|"enviado"|"cancelado" }
router.patch('/:id/status', (req, res) => {
  return res.status(501).json({ message: 'Não implementado (admin: atualizar status do pedido)' });
});

export default router;
