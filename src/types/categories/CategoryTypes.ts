export interface CategoryItem {
  id: number;
  name: string;
}

export interface CategoryApiResponse {
  items: CategoryItem[];
}
