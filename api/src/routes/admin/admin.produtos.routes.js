import { Router } from 'express';
import * as produtoController from '../../controllers/produtos.controller.js';
const router = Router();

// GET /admin/produtos – visão admin
router.get('/', produtoController.listar);

// POST /admin/produtos – criar
router.post('/', produtoController.criar);

// PATCH /admin/produtos/:id – editar
router.patch('/:id', produtoController.editar);

// DELETE /admin/produtos/:id – remover
router.delete('/:id', produtoController.remover);

export default router;
