import {
  normalizeListQuery,
  normalizeCreateBody,
  normalizeUpdateBody,
} from "../domain/produtos.dto.js";
import {
  listarProdutos,
  findById,
  toggleFavorite,
  atualizarProduto,
  criarProduto,
  removerProduto,
} from "../services/produtos.service.js";

// GET /produtos - usado para public e rota admin
export async function listar(req, res, next) {
  try {
    const filtros = normalizeListQuery(req.query); // valida e normaliza
    const data = await listarProdutos(filtros);
    return res.status(200).json(data);
  } catch (err) {
    // erros de validação (zod) cairão aqui
    if (err?.issues) {
      err.status = 422;
      err.message = "Parâmetros inválidos";
      err.details = err.issues;
    }
    return next(err);
  }
}

// POST /admin/produtos 
export async function criar(req, res, next) {
  try {
    const data = normalizeCreateBody(req.body); // valida + calcula price
    const created = await criarProduto(data);
    return res.status(201).json(created);
  } catch (err) {
    if (err?.issues) {
      err.status = 422;
      err.message = 'Dados inválidos';
      err.details = err.issues;
    }
    return next(err);
  }
}

// PATCH /admin/produtos/:id 
export async function editar(req, res, next) {
  try {
    const { id } = req.params;
    const data = normalizeUpdateBody(req.body); // valida campos parciais
    const updated = await atualizarProduto(id, data);
    return res.status(200).json(updated);
  } catch (err) {
    if (err?.issues) {
      err.status = 422;
      err.message = 'Dados inválidos';
      err.details = err.issues;
    }
    return next(err);
  }
}

// DELETE /admin/produtos/:id 
export async function remover(req, res, next) {
  try {
    const { id } = req.params;
    await removerProduto(id);
    return res.status(204).send();
  } catch (err) {
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
    error.message = "Produto não encontrado";
    return next(error);
  }
};

/**
 * Controla a requisição para favoritar/desfavoritar um produto.
 */
export const favoritarProduto = async (req, res, next) => {
  try {
    const { id: productId } = req.params;

    //  Por enquanto, vou simular o ID do usuário.
    // Mais na frente, ele vai vir de um token de autenticação (JWT) mesmo.
    const { userId } = req.body;

    // Validação simples para garantir que o userId foi enviado
    if (!userId) {
      return res.status(400).json({ message: "userId é obrigatório." });
    }

    const result = await toggleFavorite(userId, productId);
    res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
};
