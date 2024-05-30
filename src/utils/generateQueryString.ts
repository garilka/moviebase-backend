export const generateQueryString = (search: string, page?: number) => {
  return `search=${search}&page=${page ?? 1}`;
};
