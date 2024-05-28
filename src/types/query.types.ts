export type QueryParams = {
  search: string;
  page?: number;
};

export type ExternalSearchMeta = {
  page: number;
  total_pages: number;
  total_results: number;
};

export type SearchMeta = {
  pageCount: number;
  resultCount: number;
};
