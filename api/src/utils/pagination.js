export function paginate({ page, perPage }) {
  const take = perPage;
  const skip = (page - 1) * perPage;
  return { skip, take };
}
