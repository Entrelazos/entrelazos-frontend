import { Address } from '../address/AddressTypes';
import { CategoryItem } from '../categories/CategoryTypes';
import { ProductItem } from '../products/ProductsTypes';
import { SocialType } from '../social/SocialTypes';
import { UserCompany } from '../user/UserTypes';

export interface CompanyItem {
  id: number;
  name: string;
  nit: string;
  description: string;
  addresses: Address[];
  products?: ProductItem[];
  categories?: CategoryItem[];
  social: SocialType;
  users: UserCompany[];
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
