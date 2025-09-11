import React, { useCallback, useState } from 'react';
import {
  Modal,
  Box,
  Typography,
  Button,
  IconButton,
  Stack,
  CircularProgress,
  Divider,
  Paper,
} from '@mui/material';
import { Close, ShoppingCart, Clear } from '@mui/icons-material';
import { toast } from 'react-toastify';

import { AddProductModalProps } from '../../../types/product-form/ProductFormTypes';
import { UnifiedProductFormData } from '../../../types/product-form/UnifiedProductFormTypes';
import { useProductForm } from '../../../hooks/useProductForm';
import UnifiedProductForm from '../../../components/ProductForm/UnifiedProductForm';
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
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [currentEditData, setCurrentEditData] = useState<UnifiedProductFormData | null>(null);

  // Product list management
  const {
    products,
    isSubmitting,
    addProduct,
    updateProduct,
    deleteProduct,
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
  });

  // Form submission handler
  const handleFormSubmit = useCallback((data: UnifiedProductFormData) => {
    if (editIndex !== null) {
      updateProduct(editIndex, data);
      toast.success('Producto actualizado en la lista');
      setEditIndex(null);
      setCurrentEditData(null);
    } else {
      addProduct(data);
      toast.success(`Producto "${data.product_name}" agregado a la lista`);
    }
  }, [editIndex, updateProduct, addProduct]);

  // Edit product handler
  const handleEditProduct = useCallback((index: number) => {
    const productToEdit = products[index];
    setEditIndex(index);
    setCurrentEditData({
      product_name: productToEdit.product_name,
      productDescription: productToEdit.productDescription,
      is_service: productToEdit.is_service,
      is_public: productToEdit.is_public,
      price: productToEdit.price,
      category_ids: productToEdit.category_ids,
      company_id: productToEdit.company_id,
      files: productToEdit.files || [],
    });
    toast.info(`Editando producto \"${productToEdit.product_name}\"`);
  }, [products]);

  // Cancel edit handler
  const handleCancelEdit = useCallback(() => {
    setEditIndex(null);
    setCurrentEditData(null);
    toast.info('Edición cancelada');
  }, []);

  // Modal close handler
  const handleModalClose = useCallback(() => {
    clearProducts();
    setEditIndex(null);
    setCurrentEditData(null);
    handleClose();
  }, [clearProducts, handleClose]);

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
            {/* Form section */}
            <Paper elevation={1} sx={{ p: 3 }}>
              <Stack direction='row' justifyContent='space-between' alignItems='center' mb={2}>
                <Typography variant='h6'>
                  {editIndex !== null ? 'Editar información del producto' : 'Información del producto'}
                </Typography>
                {editIndex !== null && (
                  <Button
                    variant='outlined'
                    size='small'
                    startIcon={<Clear />}
                    onClick={handleCancelEdit}
                  >
                    Cancelar edición
                  </Button>
                )}
              </Stack>
              
              <UnifiedProductForm
                mode='create'
                onSubmit={handleFormSubmit}
                companyId={companyId}
                initialData={currentEditData || undefined}
                submitButtonText={editIndex !== null ? 'Actualizar producto' : 'Agregar producto a la lista'}
              />
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
                        categories={[]} // Categories will be fetched inside the component
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