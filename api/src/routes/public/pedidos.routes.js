import { Router } from 'express';
const router = Router();

// POST /pedidos – cria pedido a partir do carrinho (checkout)
router.post('/', (req, res) => {
  return res.status(501).json({ message: 'Não implementado (criar pedido)' });
});

// GET /pedidos – lista meus pedidos
router.get('/', (req, res) => {
  return res.status(501).json({ message: 'Não implementado (listar meus pedidos)' });
});

// GET /pedidos/:id – detalhe do meu pedido
router.get('/:id', (req, res) => {
  return res.status(501).json({ message: 'Não implementado (detalhar meu pedido)' });
});

export default router;
