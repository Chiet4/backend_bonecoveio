import * as adminUsuariosService from '../services/admin.usuarios.service.js';

/**
 * Controla a requisição para listar todos os usuários.
 */
export const listar = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 12;

    const result = await adminUsuariosService.listarUsuarios({ page, perPage });

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};