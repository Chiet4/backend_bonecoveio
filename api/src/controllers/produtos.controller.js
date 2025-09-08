import { normalizeListQuery } from '../domain/produtos.dto.js';
import { listarProdutos, findById } from '../services/produtos.service.js';

export async function listar(req, res, next) {
  try {
    const filtros = normalizeListQuery(req.query); // valida e normaliza
    const data = await listarProdutos(filtros);
    return res.status(200).json(data);
  } catch (err) {
    // erros de validação (zod) cairão aqui
    if (err?.issues) {
      err.status = 422;
      err.message = 'Parâmetros inválidos';
      err.details = err.issues;
    }
    return next(err);
  }
}

/**
 * Controla a requisição para buscar um produto por ID.
 */
export const getById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await findById(id);
    res.status(200).json(product);
  } catch (error) {
    // Segue o padrão passando o erro para o próximo middleware
    error.status = 404;
    error.message = 'Produto não encontrado';
    return next(error);
  }
};