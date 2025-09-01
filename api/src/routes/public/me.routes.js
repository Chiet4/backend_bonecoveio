import { Router } from 'express';
const router = Router();

// GET /me/favoritos – lista favoritos do usuário logado
router.get('/favoritos', (req, res) => {
  return res.status(501).json({ message: 'Não implementado (listar meus favoritos)' });
});

export default router;
