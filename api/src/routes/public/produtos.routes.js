import { Router } from 'express';
import * as produtoController from '../../controllers/produtos.controller.js';

const router = Router();

// GET /produtos – lista com filtros
router.get('/', produtoController.listar);

// GET /produtos/:id – detalhe
router.get('/:id', produtoController.getById);

// POST /produtos/:id/favoritos – toggle favorito para o usuário logado
router.post('/:id/favoritos', produtoController.favoritarProduto);

export default router;
