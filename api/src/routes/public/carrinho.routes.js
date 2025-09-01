import { Router } from 'express';
const router = Router();

// GET /carrinho – ver itens do carrinho
router.get('/', (req, res) => {
  return res.status(501).json({ message: 'Não implementado (ver carrinho)' });
});

// POST /carrinho/items – { produtoId, quantidade }
router.post('/items', (req, res) => {
  return res.status(501).json({ message: 'Não implementado (adicionar item ao carrinho)' });
});

// PATCH /carrinho/items/:itemId – { quantidade }
router.patch('/items/:itemId', (req, res) => {
  return res.status(501).json({ message: 'Não implementado (atualizar item do carrinho)' });
});

// DELETE /carrinho/items/:itemId
router.delete('/items/:itemId', (req, res) => {
  return res.status(501).json({ message: 'Não implementado (remover item do carrinho)' });
});

export default router;
