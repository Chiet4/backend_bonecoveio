import { Router } from 'express';
import * as adminUsuariosController from '../../controllers/admin.usuarios.controller.js';

const router = Router();

// GET /admin/usuarios – listar com filtros
router.get('/', adminUsuariosController.listar);

// GET /admin/usuarios/:id – detalhe de um usuário
router.get('/:id', adminUsuariosController.getById);

// PATCH /admin/usuarios/:id/role – { role: "ADMIN"|"USER" }
router.patch('/:id/role', (req, res) => {
  return res.status(501).json({ message: 'Não implementado (admin: alterar role de usuário)' });
});

// DELETE /admin/usuarios/:id
router.delete('/:id', (req, res) => {
  return res.status(501).json({ message: 'Não implementado (admin: remover usuário)' });
});

export default router;
