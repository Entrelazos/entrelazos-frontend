import { ProductItem } from '../products/ProductsTypes';

export interface CategoryItem {
  id: number;
  category_name: string;
  image: string;
  products?: ProductItem[];
}

export interface CategoryApiResponse {
  items: CategoryItem[];
}
