import { Router } from 'express';
const router = Router();

// GET /produtos – lista com filtros ?q=&isNew=&minPrice=&maxPrice=&page=&perPage=
router.get('/', (req, res) => {
  return res.status(501).json({ message: 'Não implementado (listar produtos)' });
});

// GET /produtos/:id – detalhe
router.get('/:id', (req, res) => {
  return res.status(501).json({ message: 'Não implementado (detalhar produto)' });
});

// POST /produtos/:id/favoritos – toggle favorito para o usuário logado
router.post('/:id/favoritos', (req, res) => {
  return res.status(501).json({ message: 'Não implementado (toggle favorito do produto)' });
});

export default router;
