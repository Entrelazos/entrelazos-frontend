export interface ProductFormData {
  product_name: string;
  productDescription: string;
  is_service: boolean;
  is_public: boolean;
  price: number | string;
  category_ids: number[];
  company_id: number;
  files: File[];
}

export interface AddProductModalProps {
  open: boolean;
  handleClose: () => void;
  onSubmit: (_data: ProductFormData[]) => Promise<void>;
  companyId: number;
}

export interface ValidationErrors {
  product_name?: string;
  productDescription?: string;
  price?: string;
  category_ids?: string;
  files?: string;
}

export interface ProductListItem extends ProductFormData {
  id?: string;
  createdAt?: Date;
}

export interface UseProductFormReturn {
  products: ProductListItem[];
  editIndex: number | null;
  isSubmitting: boolean;
  addProduct: (_data: ProductFormData) => void;
  updateProduct: (_index: number, _data: ProductFormData) => void;
  deleteProduct: (_index: number) => void;
  editProduct: (_index: number) => void;
  submitAllProducts: () => Promise<void>;
  clearProducts: () => void;
}
