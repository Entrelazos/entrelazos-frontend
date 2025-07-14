import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select from '@mui/material/Select';
import FormHelperText from '@mui/material/FormHelperText';
import Skeleton from '@mui/material/Skeleton';
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
import {
  CreateProductType,
  ProductItem,
} from '../../types/products/ProductsTypes';
import { CategoryItem } from '../../types/categories/CategoryTypes';
import TiptapEditor from '../../components/TipTapEditor/TipTapEditor';

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
        Editar Producto
      </Typography>

      {loading ? (
        <Skeleton variant='rectangular' width='100%' height={400} />
      ) : (
        <form onSubmit={handleSubmit(handleUpdateProduct)}>
          <TextField
            label='Nombre del Producto'
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
              <TiptapEditor value={field.value} onChange={field.onChange} />
            )}
          />
          {errors.productDescription && (
            <FormHelperText error>
              {errors.productDescription.message}
            </FormHelperText>
          )}

          <FormControlLabel
            control={<Checkbox {...register('is_service')} />}
            label='Servicio'
            checked={watch('is_service')}
          />
          <FormControlLabel
            control={<Checkbox {...register('is_public')} />}
            label='Publico'
            checked={watch('is_public')}
          />

          <TextField
            label='Precio'
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
                  <InputLabel>Categorias</InputLabel>
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
            Actualizar Producto
          </Button>
        </form>
      )}
    </Box>
  );
};

export default EditProductPage;
