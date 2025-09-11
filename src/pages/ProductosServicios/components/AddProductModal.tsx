import React, { useEffect, useMemo, useCallback } from 'react';
import {
  Modal,
  Box,
  Typography,
  Button,
  IconButton,
  Stack,
  Alert,
  CircularProgress,
  Divider,
  Paper,
} from '@mui/material';
import { Close, Add, Save, ShoppingCart } from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import { fetchCategories } from '../../../store/categories/categoriesThunks';
import { AppDispatch, RootState } from '../../../store/store';
import { AddProductModalProps, ProductFormData } from '../../../types/product-form/ProductFormTypes';
import { useProductForm } from '../../../hooks/useProductForm';
import { productValidationSchema } from '../../../utils/validation/productValidationSchema';
import ProductFormFields from './ProductFormFields';
import ProductListItem from './ProductListItem';

const modalStyles = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: {
    xs: '95vw',
    sm: '90vw', 
    md: '80vw',
    lg: '70vw',
    xl: '60vw',
  },
  maxWidth: '900px',
  height: {
    xs: '95vh',
    sm: '90vh',
  },
  bgcolor: 'background.paper',
  boxShadow: 24,
  borderRadius: 2,
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
};

const AddProductModal: React.FC<AddProductModalProps> = ({
  open,
  handleClose,
  onSubmit,
  companyId,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { 
    data: categories, 
    loading: categoriesLoading, 
    error: categoriesError 
  } = useSelector((state: RootState) => state.categories);

  // Fetch categories on mount
  useEffect(() => {
    if (open && !categories) {
      dispatch(fetchCategories());
    }
  }, [dispatch, categories, open]);

  // Form management
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    control,
    formState: { errors, isValid },
  } = useForm<ProductFormData>({
    resolver: yupResolver(productValidationSchema),
    mode: 'onBlur',
    defaultValues: {
      product_name: '',
      productDescription: '',
      is_service: false,
      is_public: false,
      price: 0,
      category_ids: [],
      company_id: companyId,
      files: [],
    },
  });

  // Product list management
  const {
    products,
    editIndex,
    isSubmitting,
    addProduct,
    updateProduct,
    deleteProduct,
    editProduct,
    submitAllProducts,
    clearProducts,
  } = useProductForm({
    onSubmit: async (productsData) => {
      try {
        await onSubmit(productsData);
        toast.success(`${productsData.length} producto${productsData.length !== 1 ? 's' : ''} creado${productsData.length !== 1 ? 's' : ''} exitosamente`);
        handleModalClose();
      } catch (error) {
        toast.error('Error al crear los productos');
        throw error;
      }
    },
    onProductAdd: (product) => {
      toast.success(`Producto \"${product.product_name}\" agregado a la lista`);
    },
    onProductDelete: () => {
      toast.info('Producto eliminado de la lista');
    },
  });

  // Form submission handler
  const onFormSubmit = useCallback((data: ProductFormData) => {
    if (editIndex !== null) {
      updateProduct(editIndex, data);
      toast.success('Producto actualizado');
    } else {
      addProduct(data);
    }

    // Reset form
    reset({
      product_name: '',
      productDescription: '',
      is_service: false,
      is_public: false,
      price: 0,
      category_ids: [],
      company_id: companyId,
      files: [],
    });
  }, [editIndex, updateProduct, addProduct, reset, companyId]);

  // Edit product handler
  const handleEditProduct = useCallback((index: number) => {
    const productToEdit = products[index];
    editProduct(index);

    // Prefill form fields
    Object.entries(productToEdit).forEach(([key, value]) => {
      if (key !== 'id' && key !== 'createdAt') {
        setValue(key as keyof ProductFormData, value);
      }
    });

    toast.info(`Editando producto \"${productToEdit.product_name}\"`);
  }, [products, editProduct, setValue]);

  // Modal close handler
  const handleModalClose = useCallback(() => {
    reset();
    clearProducts();
    handleClose();
  }, [reset, clearProducts, handleClose]);


  return (
    <Modal 
      open={open} 
      onClose={handleModalClose}
      aria-labelledby='add-product-modal-title'
      aria-describedby='add-product-modal-description'
    >
      <Box sx={modalStyles}>
        {/* Header */}
        <Paper 
          elevation={1} 
          sx={{ 
            p: 2, 
            borderRadius: 0,
            borderBottom: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Stack direction='row' justifyContent='space-between' alignItems='center'>
            <Typography 
              id='add-product-modal-title'
              variant='h5' 
              component='h2'
              fontWeight='bold'
            >
              {editIndex !== null ? 'Editar Producto' : 'Agregar Productos'}
            </Typography>
            <IconButton 
              onClick={handleModalClose}
              size='large'
              aria-label='Cerrar modal'
            >
              <Close />
            </IconButton>
          </Stack>
        </Paper>

        {/* Content */}
        <Box 
          sx={{ 
            flex: 1, 
            overflow: 'auto', 
            p: 3,
          }}
        >
          <Stack spacing={3}>
            {/* Error alerts */}
            {categoriesError && (
              <Alert severity='error' onClose={() => dispatch({ type: 'CLEAR_CATEGORIES_ERROR' })}>
                Error cargando categorías: {categoriesError}
              </Alert>
            )}

            {/* Form section */}
            <Paper elevation={1} sx={{ p: 3 }}>
              <Typography variant='h6' gutterBottom>
                {editIndex !== null ? 'Editar información del producto' : 'Información del producto'}
              </Typography>
              
              <form onSubmit={handleSubmit(onFormSubmit)}>
                <ProductFormFields
                  control={control}
                  register={register}
                  errors={errors}
                  watch={watch}
                  setValue={setValue}
                  categories={categories || []}
                  categoriesLoading={categoriesLoading}
                  categoriesError={categoriesError}
                />
                
                <Box sx={{ mt: 3 }}>
                  <Button
                    type='submit'
                    variant='contained'
                    color='primary'
                    size='large'
                    fullWidth
                    disabled={!isValid}
                    startIcon={editIndex !== null ? <Save /> : <Add />}
                  >
                    {editIndex !== null ? 'Actualizar producto' : 'Agregar producto a la lista'}
                  </Button>
                </Box>
              </form>
            </Paper>

            {/* Products list */}
            {products.length > 0 && (
              <Paper elevation={1} sx={{ p: 3 }}>
                <Stack spacing={2}>
                  <Box display='flex' justifyContent='space-between' alignItems='center'>
                    <Typography variant='h6'>
                      Productos agregados ({products.length})
                    </Typography>
                    <Button
                      variant='outlined'
                      size='small'
                      onClick={clearProducts}
                      disabled={isSubmitting}
                    >
                      Limpiar lista
                    </Button>
                  </Box>
                  
                  <Divider />
                  
                  <Stack spacing={2}>
                    {products.map((product, index) => (
                      <ProductListItem
                        key={product.id}
                        product={product}
                        index={index}
                        onEdit={handleEditProduct}
                        onDelete={deleteProduct}
                        categories={categories || []}
                      />
                    ))}
                  </Stack>
                </Stack>
              </Paper>
            )}
          </Stack>
        </Box>

        {/* Footer */}
        {products.length > 0 && (
          <Paper 
            elevation={1} 
            sx={{ 
              p: 2, 
              borderRadius: 0,
              borderTop: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Button
              variant='contained'
              color='success'
              size='large'
              fullWidth
              onClick={submitAllProducts}
              disabled={isSubmitting}
              startIcon={
                isSubmitting ? (
                  <CircularProgress size={20} color='inherit' />
                ) : (
                  <ShoppingCart />
                )
              }
            >
              {isSubmitting 
                ? 'Guardando productos...' 
                : `Guardar todos los productos (${products.length})`
              }
            </Button>
          </Paper>
        )}
      </Box>
    </Modal>
  );
};

export default AddProductModal;