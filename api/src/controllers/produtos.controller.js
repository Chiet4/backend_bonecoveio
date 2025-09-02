import { normalizeListQuery } from '../domain/produtos.dto.js';
import { listarProdutos } from '../services/produtos.service.js';

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
