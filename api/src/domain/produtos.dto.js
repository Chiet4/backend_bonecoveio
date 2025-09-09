import { z } from 'zod';

export const listProductsQuerySchema = z.object({
  q: z.string().trim().min(1).optional(),
  isNew: z.enum(['true', 'false']).optional(),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
  page: z.coerce.number().int().min(1).default(1),
  perPage: z.coerce.number().int().min(1).max(100).default(12),
});

// Normaliza para tipos finais usados no service
export function normalizeListQuery(query) {
  const parsed = listProductsQuerySchema.parse(query);

  return {
    q: parsed.q,
    isNew: parsed.isNew ? parsed.isNew === 'true' : undefined,
    minPrice: parsed.minPrice,
    maxPrice: parsed.maxPrice,
    page: parsed.page,
    perPage: parsed.perPage,
  };
}

/** --------- ADMIN: CREATE / UPDATE --------- **/

// CREATE
export const createProductSchema = z.object({
  imageSrc: z.string().url(),
  title: z.string().min(2),
  description: z.string().min(2),
  originalPrice: z.coerce.number().min(0),
  discount: z.coerce.number().min(0).max(100).optional(),
  isNew: z.coerce.boolean().optional().default(false),
  rating: z.coerce.number().int().min(0).max(5).optional().default(0),
  stock: z.coerce.number().int().min(0).default(0),
});

// Calcula price a partir de originalPrice e discount
export function normalizeCreateBody(body) {
  const data = createProductSchema.parse(body);
  const discount = data.discount ?? undefined;
  const price = discount != null
    ? Number((data.originalPrice - (data.originalPrice * discount) / 100).toFixed(2))
    : data.originalPrice;

  return { ...data, price };
}

// UPDATE (parcial)
export const updateProductSchema = z.object({
  imageSrc: z.string().url().optional(),
  title: z.string().min(2).optional(),
  description: z.string().min(2).optional(),
  originalPrice: z.coerce.number().min(0).optional(),
  discount: z.coerce.number().min(0).max(100).nullable().optional(),
  isNew: z.coerce.boolean().optional(),
  rating: z.coerce.number().int().min(0).max(5).optional(),
  stock: z.coerce.number().int().min(0).optional(),
});

export function normalizeUpdateBody(body) {
  const data = updateProductSchema.parse(body);

  // Se mexeu em originalPrice e/ou discount, recalcule price
  const willRecalc =
    Object.prototype.hasOwnProperty.call(data, 'originalPrice') ||
    Object.prototype.hasOwnProperty.call(data, 'discount');

  if (willRecalc) {
    const originalPrice =
      data.originalPrice != null ? data.originalPrice : undefined;
    const discount =
      data.discount === null ? undefined // permite “remover” desconto
      : data.discount != null ? data.discount
      : undefined;

    // Para recalcular, precisamos do originalPrice atual: resolvemos no service,
    // mas se ele veio no body já calculamos aqui (adianta trabalho).
    if (originalPrice != null) {
      const price = discount != null
        ? Number((originalPrice - (originalPrice * discount) / 100).toFixed(2))
        : originalPrice;
      return { ...data, originalPrice, discount, price };
    }
    // Se não veio originalPrice mas veio discount, o service buscará o atual.
  }

  return data; // sem alterações de preço
}