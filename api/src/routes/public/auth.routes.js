import { Router } from 'express';
const router = Router();

// POST /auth/register – cria usuário
router.post('/register', (req, res) => {
  return res.status(501).json({ message: 'Não implementado (auth/register)' });
});

// POST /auth/login – retorna JWT
router.post('/login', (req, res) => {
  return res.status(501).json({ message: 'Não implementado (auth/login)' });
});

// GET /auth/me – retorna usuário do token
router.get('/me', (req, res) => {
  return res.status(501).json({ message: 'Não implementado (auth/me)' });
});

// POST /auth/refresh – emite novo access token a partir de refresh token
router.post('/refresh', (req, res) => {
  return res.status(501).json({ message: 'Não implementado (auth/refresh)' });
});

export default router;
