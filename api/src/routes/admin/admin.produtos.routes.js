import { Router } from 'express';
const router = Router();

// GET /admin/produtos – visão admin
router.get('/', (req, res) => {
  return res.status(501).json({ message: 'Não implementado (admin: listar produtos)' });
});

// POST /admin/produtos – criar
router.post('/', (req, res) => {
  return res.status(501).json({ message: 'Não implementado (admin: criar produto)' });
});

// PATCH /admin/produtos/:id – editar
router.patch('/:id', (req, res) => {
  return res.status(501).json({ message: 'Não implementado (admin: editar produto)' });
});

// DELETE /admin/produtos/:id – remover
router.delete('/:id', (req, res) => {
  return res.status(501).json({ message: 'Não implementado (admin: remover produto)' });
});

export default router;
