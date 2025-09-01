import { Router } from 'express';
const router = Router();

// GET /admin/usuarios – listar com filtros ?q=&page=&perPage=
router.get('/', (req, res) => {
  return res.status(501).json({ message: 'Não implementado (admin: listar usuários)' });
});

// PATCH /admin/usuarios/:id/role – { role: "ADMIN"|"USER" }
router.patch('/:id/role', (req, res) => {
  return res.status(501).json({ message: 'Não implementado (admin: alterar role de usuário)' });
});

// DELETE /admin/usuarios/:id
router.delete('/:id', (req, res) => {
  return res.status(501).json({ message: 'Não implementado (admin: remover usuário)' });
});

export default router;
