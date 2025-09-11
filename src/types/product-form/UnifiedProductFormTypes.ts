import { ProductFormData } from './ProductFormTypes';

export interface ExistingImage {
  id: number;
  url: string;
}

export interface UnifiedProductFormData extends ProductFormData {
  existingImages?: number[]; // For edit mode - tracks which existing images to keep
}

export type ProductFormMode = 'create' | 'edit';

export interface UnifiedProductFormProps {
  mode: ProductFormMode;
  onSubmit: (_data: UnifiedProductFormData) => Promise<void> | void;
  onCancel?: () => void;
  initialData?: Partial<UnifiedProductFormData>;
  existingImages?: ExistingImage[];
  loading?: boolean;
  submitButtonText?: string;
  showCancelButton?: boolean;
  companyId?: number;
}

export interface UseUnifiedProductFormProps {
  mode: ProductFormMode;
  initialData?: Partial<UnifiedProductFormData>;
  existingImages?: ExistingImage[];
  companyId?: number;
}

export interface UseUnifiedProductFormReturn {
  // React Hook Form
  register: any;
  handleSubmit: any;
  reset: any;
  setValue: any;
  watch: any;
  control: any;
  formState: any;
  trigger: any;
  
  // Custom state
  currentExistingImages: ExistingImage[];
  newFiles: File[];
  
  // Handlers
  handleRemoveExistingImage: (_imageId: number) => void;
  handleNewFilesChange: (_files: File[]) => void;
  resetForm: () => void;
}