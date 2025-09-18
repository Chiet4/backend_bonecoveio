import { Router } from 'express';
// Importando um novo controlador aqui no topo
import * as adminUsuariosController from '../../controllers/admin.usuarios.controller.js';

const router = Router();

// Substituição da função antiga desta rota pela chamada ao seu controlador
router.get('/', adminUsuariosController.listar);

// PATCH /admin/usuarios/:id/role – { role: "ADMIN"|"USER" }
router.patch('/:id/role', (req, res) => {
  return res.status(501).json({ message: 'Não implementado (admin: alterar role de usuário)' });
});

// DELETE /admin/usuarios/:id
router.delete('/:id', (req, res) => {
  return res.status(501).json({ message: 'Não implementado (admin: remover usuário)' });
});

export default router;
