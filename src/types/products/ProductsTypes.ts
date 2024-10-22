import { CategoryItem } from '../categories/CategoryTypes';
import { CompanyItem } from '../companies/CompaniesTypes';

export interface ProductItem {
  id: number;
  product_name: string;
  price: number;
  is_public: boolean;
  is_service: boolean;
  is_approved: boolean;
  company: CompanyItem;
}

export interface CreateProductType {
  product_name: string;
  productDescription: string;
  is_service: boolean;
  is_public: boolean;
  is_approved: boolean;
  price: number;
  category_ids: number[];
  company_id: number;
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
