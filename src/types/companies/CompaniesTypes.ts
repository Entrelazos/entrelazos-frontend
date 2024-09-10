import { Address } from '../address/AddressTypes';
import { CategoryItem } from '../categories/CategoryTypes';
import { ProductItem } from '../products/ProductsTypes';
import { SocialType } from '../social/SocialTypes';

export interface CompanyItem {
  id: number;
  name: string;
  type: string;
  nit: string;
  description: string;
  addresses: Address[];
  products?: ProductItem[];
  categories?: CategoryItem[];
  social: SocialType;
}

export interface CompanyMeta {
  totalItems: number;
  itemCount: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
}

export interface CompanyApiResponse {
  items: CompanyItem[];
  meta: CompanyMeta;
}
