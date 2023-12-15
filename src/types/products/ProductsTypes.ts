export interface ProductItem {
  id: number;
  name: string;
  type: string;
  nit: string;
  description: string;
}

export interface ProductMeta {
  totalItems: number;
  itemCount: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
}

export interface ProductApiResponse {
  items: ProductItem[];
  meta: ProductMeta;
}
