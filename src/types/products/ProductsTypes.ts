import { ApprovalStatus } from '../../constants/constants';
import { CategoryItem } from '../categories/CategoryTypes';
import { CompanyItem } from '../companies/CompaniesTypes';

export interface ProductItem {
  id: number;
  product_name: string;
  price: number;
  is_public: boolean;
  is_service: boolean;
  approval_status:
    | ApprovalStatus.PENDING
    | ApprovalStatus.APPROVED
    | ApprovalStatus.REJECTED;
  product_description: string;
  company: CompanyItem;
  images: string[];
  categories: CategoryItem[];
}

export interface CreateProductType {
  product_name: string;
  productDescription: string;
  is_service: boolean;
  is_public: boolean;
  approval_status:
    | ApprovalStatus.PENDING
    | ApprovalStatus.APPROVED
    | ApprovalStatus.REJECTED;
  price: number;
  category_ids: number[];
  company_id: number;
  files: File[];
  existingImages: number[];
}

export interface ProductMeta {
  totalItems: number;
  itemCount: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
}

export interface ProductApiResponse {
  items: CompanyItem[];
  meta: ProductMeta;
}

export interface ProductByCompanyApiResponse {
  items: ProductItem[];
  meta: ProductMeta;
}
