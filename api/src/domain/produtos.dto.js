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
