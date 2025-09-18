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
/**
 * Controla a requisição para buscar um usuário por ID.
 */
export const getById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await adminUsuariosService.findUserById(id);
    res.status(200).json(user);
  } catch (error) {
    // Tratamento de erros
    error.status = 404;
    error.message = 'Usuário não encontrado';
    return next(error);
  }
};