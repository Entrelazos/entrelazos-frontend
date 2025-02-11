import { Address } from '../address/AddressTypes';
import { CategoryItem } from '../categories/CategoryTypes';
import { ProductItem } from '../products/ProductsTypes';
import { SocialType } from '../social/SocialTypes';
import { UserCompany } from '../user/UserTypes';

export interface Image {
  created_at: Date;
  updated_at: Date;
  id: number;
  url: string;
  alt_text: string;
  description: string;
  entity_id: number;
  entity_type: string;
  image_type: string;
}

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
  images: Image[];
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
