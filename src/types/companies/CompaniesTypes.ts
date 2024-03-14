import { Address } from '../address/AddressTypes';

export interface CompanyItem {
  id: number;
  name: string;
  type: string;
  nit: string;
  description: string;
  address: Address;
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
