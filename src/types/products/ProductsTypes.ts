import { CategoryItem } from '../categories/CategoryTypes';

export interface ProductItem {
  id: number;
  product_name: string;
  price: number;
  is_public: boolean;
  is_service: boolean;
  is_approved: boolean;
}

export interface ProductMeta {
  totalItems: number;
  itemCount: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
}

export interface ProductApiResponse {
  items: CategoryItem[];
  meta: ProductMeta;
}
