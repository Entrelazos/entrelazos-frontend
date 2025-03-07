import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  FormHelperText,
  Skeleton,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchCategories } from '../../store/categories/categoriesThunks';
import { AppDispatch, RootState } from '../../store/store';
import {
  getSingleProduct,
  updateProduct,
} from '../../services/products/productsService';
import FileDropZone from '../../components/FileDropZone/FileDropZone';
import {
  getFilesByEntityIdAndType,
  // uploadFiles,
} from '../../services/upload/uploadService';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {
  CreateProductType,
  ProductItem,
} from '../../types/products/ProductsTypes';
import { CategoryItem } from '../../types/categories/CategoryTypes';

// Validation Schema
const validationSchema = yup.object({
  product_name: yup.string().required('Product name is required'),
  productDescription: yup.string().required('Product description is required'),

  is_service: yup.boolean().oneOf([true, false]).default(false),
  is_public: yup.boolean().oneOf([true, false]).default(false),

  price: yup
    .number()
    .transform((value, originalValue) =>
      originalValue === '' ? undefined : Number(originalValue)
    )
    .typeError('Price must be a number')
    .required('Price is required')
    .min(0, 'Price must be a positive number'),

  company_id: yup
    .number()
    .transform((value, originalValue) =>
      originalValue === '' ? undefined : Number(originalValue)
    )
    .typeError('Company ID must be a number')
    .required('Company is required')
    .integer(),

  category_ids: yup
    .array()
    .of(
      yup
        .number()
        .transform((value, originalValue) =>
          originalValue === '' ? undefined : Number(originalValue)
        )
        .typeError('Each category must be a number')
        .required()
        .integer()
    )
    .min(1, 'At least one category is required'),

  files: yup
    .array()
    .of(
      yup
        .mixed()
        .test('fileSize', 'File size is too large', (value) =>
          value instanceof File ? value.size <= 2 * 1024 * 1024 : true
        )
        .test('fileType', 'Unsupported file type', (value) =>
          value instanceof File
            ? ['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(
                value.type
              )
            : true
        )
    )
    .default([]),
});

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const EditProductPage: React.FC = () => {
  const { productId } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { data: categories } = useSelector(
    (state: RootState) => state.categories
  );
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<ProductItem>(null);
  const [images, setImages] = useState<{ url: string; id: number }[]>([]);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<number[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      product_name: '',
      company_id: null,
      productDescription: '',
      is_service: false,
      is_public: false,
      price: 0,
      category_ids: [],
      files: [],
    },
  });

  useEffect(() => {
    if (!categories?.length) {
      dispatch(fetchCategories());
    }
  }, [dispatch, categories?.length]);

  useEffect(() => {
    const fetchProductData = async () => {
      if (!productId) return;

      try {
        setLoading(true);
        const productData = await getSingleProduct(productId);
        setProduct(productData);

        setValue('product_name', productData.product_name);
        setValue('company_id', productData.company.id);
        setValue('productDescription', productData.product_description);
        setValue('is_service', productData.is_service);
        setValue('is_public', productData.is_public);
        setValue('price', productData.price);
        setValue(
          'category_ids',
          productData.categories?.map((c: CategoryItem) => c.id) || []
        );

        const productImages = await getFilesByEntityIdAndType(
          parseInt(productId),
          'product'
        );
        const imageUrls = productImages.map(
          (img: { url: string; id: number }) => ({
            url: `${import.meta.env.VITE_BASE_FILES_URL}${img.url}`,
            id: img.id, // Store image ID
          })
        );
        setImages(imageUrls);
        setExistingImages(imageUrls.map((img) => img.id)); // Store existing image IDs
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [productId, setValue]);

  const handleRemoveImage = (imageId: number) => {
    setExistingImages((prev) => prev.filter((id) => id !== imageId));
    setImages((prevImages) => prevImages.filter((img) => img.id !== imageId));
  };

  const handleUpdateProduct = async (data: CreateProductType) => {
    try {
      setLoading(true);
      await updateProduct(parseInt(productId)!, {
        ...data,
        company_id: product?.company.id, // Fix undefined company_id
        files: [...(data.files || []), ...newFiles], // Ensure files are sent
        existingImages,
      });

      navigate(`/productos/${productId}`);
    } catch (error) {
      console.error('Error updating product:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box width='100%' maxWidth='800px' mx='auto' p={3}>
      <Typography variant='h5' mb={2}>
        Edit Product
      </Typography>

      {loading ? (
        <Skeleton variant='rectangular' width='100%' height={400} />
      ) : (
        <form onSubmit={handleSubmit(handleUpdateProduct)}>
          <TextField
            label='Product Name'
            fullWidth
            {...register('product_name')}
            error={!!errors.product_name}
            helperText={errors.product_name?.message}
            margin='normal'
          />

          <Controller
            name='productDescription'
            control={control}
            render={({ field }) => (
              <ReactQuill
                theme='snow'
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
          {errors.productDescription && (
            <FormHelperText error>
              {errors.productDescription.message}
            </FormHelperText>
          )}

          <FormControlLabel
            control={<Checkbox {...register('is_service')} />}
            label='Is Service'
            checked={watch('is_service')}
          />
          <FormControlLabel
            control={<Checkbox {...register('is_public')} />}
            label='Is Public'
            checked={watch('is_public')}
          />

          <TextField
            label='Price'
            type='number'
            fullWidth
            {...register('price')}
            error={!!errors.price}
            helperText={errors.price?.message}
            margin='normal'
          />

          {categories && (
            <Controller
              name='category_ids'
              control={control}
              render={({ field }) => (
                <FormControl fullWidth margin='normal'>
                  <InputLabel>Categories</InputLabel>
                  <Select
                    {...field}
                    multiple
                    input={<OutlinedInput />}
                    MenuProps={MenuProps}
                  >
                    {categories.map((category) => (
                      <MenuItem key={category.id} value={category.id}>
                        {category.category_name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            />
          )}

          <FileDropZone
            onDrop={(acceptedFiles) => setNewFiles(acceptedFiles)}
            existingFiles={images}
            onRemoveImage={(image) => handleRemoveImage(image.id)}
          />

          {/* {images.length > 0 && (
            <CarouselComponent images={images} width='100%' />
          )} */}

          <Button
            type='submit'
            variant='contained'
            color='primary'
            fullWidth
            sx={{ mt: 2 }}
          >
            Update Product
          </Button>
        </form>
      )}
    </Box>
  );
};

export default EditProductPage;
