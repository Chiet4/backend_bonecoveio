import { Router } from 'express';
import * as meController from '../../controllers/me.controller.js';

const router = Router();

// GET /me/favoritos – lista favoritos do usuário logado
router.get('/favoritos', meController.listarFavoritos);

export default router;