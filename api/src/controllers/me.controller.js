import * as meService from '../services/me.service.js';

/**
 * Controla a requisição para listar os favoritos do usuário.
 */
export const listarFavoritos = async (req, res, next) => {
  try {
    const { userId } = req.body; // Simulado por enquanto
    if (!userId) {
      return res.status(400).json({ message: 'userId é obrigatório.' });
    }

    // Pega os dados de paginação da URL (query params)
    // Se não forem passados, usa valores padrão.
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 12;

    const data = await meService.findFavoritesByUserId(userId, { page, perPage });

    res.status(200).json(data);
  } catch (error) {
    return next(error);
  }
};