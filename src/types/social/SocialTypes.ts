import { Address } from '../address/AddressTypes';
import { ProductItem } from '../products/ProductsTypes';

export interface SocialType {
  id?: number;
  email: string;
  facebook: string;
  instagram: string;
  linkedin: string;
  phone_number: string;
  whatsapp: string;
  x?: string;
}
