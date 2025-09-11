import { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import { fetchCategories } from '../store/categories/categoriesThunks';
import { productValidationSchema } from '../utils/validation/productValidationSchema';
import {
  UseUnifiedProductFormProps,
  UseUnifiedProductFormReturn,
  ExistingImage,
  UnifiedProductFormData,
} from '../types/product-form/UnifiedProductFormTypes';

export const useUnifiedProductForm = ({
  mode,
  initialData,
  existingImages = [],
  companyId,
}: UseUnifiedProductFormProps): UseUnifiedProductFormReturn => {
  const dispatch = useDispatch<AppDispatch>();
  const { data: categories } = useSelector((state: RootState) => state.categories);

  // Local state for image management
  const [currentExistingImages, setCurrentExistingImages] = useState<ExistingImage[]>(existingImages);
  const [newFiles, setNewFiles] = useState<File[]>([]);

  // Fetch categories if not loaded
  useEffect(() => {
    if (!categories?.length) {
      dispatch(fetchCategories());
    }
  }, [dispatch, categories?.length]);

  // Default form values - memoized to prevent object recreation
  const getDefaultValues = useMemo((): UnifiedProductFormData => ({
    product_name: '',
    productDescription: '',
    is_service: false,
    is_public: false,
    price: 0,
    category_ids: [],
    company_id: companyId || 0,
    files: [],
    existingImages: [],
  }), [companyId]);

  // Initialize form
  const form = useForm<UnifiedProductFormData>({
    resolver: yupResolver(productValidationSchema),
    mode: 'onBlur',
    defaultValues: getDefaultValues,
  });

  const { register, handleSubmit, reset, setValue, watch, control, formState, trigger } = form;

  // Use refs to track changes and prevent infinite loops
  const initialDataSet = useRef(false);
  const initialDataRef = useRef(initialData);
  
  // Set initial data when provided
  useEffect(() => {
    if (initialData && mode === 'edit' && !initialDataSet.current && initialData !== initialDataRef.current) {
      Object.entries(initialData).forEach(([key, value]) => {
        if (key !== 'existingImages' && value !== undefined) {
          setValue(key as keyof UnifiedProductFormData, value);
        }
      });
      initialDataSet.current = true;
      initialDataRef.current = initialData;
    }
  }, [initialData, mode, setValue]);

  // Update existing images when they change - use deep comparison to prevent unnecessary updates
  const existingImagesRef = useRef(existingImages);
  useEffect(() => {
    // Simple deep equality check for existing images array
    const hasChanged = existingImages.length !== existingImagesRef.current.length ||
      existingImages.some((img, index) => 
        !existingImagesRef.current[index] || 
        img.id !== existingImagesRef.current[index].id ||
        img.url !== existingImagesRef.current[index].url
      );
      
    if (hasChanged) {
      setCurrentExistingImages(existingImages);
      if (mode === 'edit') {
        setValue('existingImages', existingImages.map(img => img.id));
      }
      existingImagesRef.current = existingImages;
      
      // Trigger validation to update form state
      trigger();
    }
  }, [existingImages, mode, setValue, trigger]);

  // Handle removing existing images
  const handleRemoveExistingImage = useCallback((imageId: number) => {
    setCurrentExistingImages(prev => prev.filter(img => img.id !== imageId));
    
    // Update the form's existingImages array
    const currentIds = watch('existingImages') || [];
    setValue('existingImages', currentIds.filter(id => id !== imageId));
    
    // Trigger validation to update form state
    trigger();
  }, [setValue, watch, trigger]);

  // Handle new files change
  const handleNewFilesChange = useCallback((files: File[]) => {
    setNewFiles(files);
    setValue('files', files);
    
    // Trigger validation to update form state
    trigger();
  }, [setValue, trigger]);

  // Reset form to initial state
  const resetForm = useCallback(() => {
    reset(getDefaultValues);
    setCurrentExistingImages([]);
    setNewFiles([]);
    initialDataSet.current = false;
  }, [reset, getDefaultValues]);

  return {
    // React Hook Form
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    control,
    formState,
    trigger,
    
    // Custom state
    currentExistingImages,
    newFiles,
    
    // Handlers
    handleRemoveExistingImage,
    handleNewFilesChange,
    resetForm,
  };
};