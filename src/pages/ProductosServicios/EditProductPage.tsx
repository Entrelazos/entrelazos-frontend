import React, { useEffect, useState } from 'react';
import { Box, Typography, Alert } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import {
  getSingleProduct,
  updateProduct,
} from '../../services/products/productsService';
import {
  getFilesByEntityIdAndType,
} from '../../services/upload/uploadService';
import { ProductItem } from '../../types/products/ProductsTypes';
import { CategoryItem } from '../../types/categories/CategoryTypes';
import { UnifiedProductFormData, ExistingImage } from '../../types/product-form/UnifiedProductFormTypes';
import UnifiedProductForm from '../../components/ProductForm/UnifiedProductForm';

const EditProductPage: React.FC = () => {
  const { productId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [product, setProduct] = useState<ProductItem | null>(null);
  const [existingImages, setExistingImages] = useState<ExistingImage[]>([]);
  const [initialFormData, setInitialFormData] = useState<UnifiedProductFormData | null>(null);

  useEffect(() => {
    const fetchProductData = async () => {
      if (!productId) {
        setError('ID de producto no válido');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Fetch product data
        const productData = await getSingleProduct(productId);
        setProduct(productData);

        // Fetch existing images
        const productImages = await getFilesByEntityIdAndType(
          parseInt(productId),
          'product'
        );
        const imageUrls = productImages.map(
          (img: { url: string; id: number }) => ({
            url: `${import.meta.env.VITE_BASE_FILES_URL}${img.url}`,
            id: img.id,
          })
        );
        setExistingImages(imageUrls);

        // Prepare initial form data
        const formData: UnifiedProductFormData = {
          product_name: productData.product_name || '',
          productDescription: productData.product_description || '',
          is_service: productData.is_service || false,
          is_public: productData.is_public || false,
          price: productData.price || 0,
          category_ids: (productData.categories?.map((c: CategoryItem) => c.id) || []) as number[],
          company_id: productData.company?.id || 0,
          files: [],
          existingImages: imageUrls.map(img => img.id),
        };
        setInitialFormData(formData);

      } catch (error) {
        console.error('Error fetching product:', error);
        setError('Error cargando los datos del producto');
        toast.error('Error cargando los datos del producto');
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [productId]);

  const handleUpdateProduct = async (data: UnifiedProductFormData) => {
    if (!productId || !product) {
      toast.error('Datos de producto no válidos');
      return;
    }

    try {
      setUpdating(true);
      
      await updateProduct(parseInt(productId), {
        product_name: data.product_name,
        productDescription: data.productDescription,
        is_service: data.is_service,
        is_public: data.is_public,
        approval_status: product.approval_status, // Keep existing approval status
        price: typeof data.price === 'string' ? parseFloat(data.price) : data.price,
        category_ids: data.category_ids,
        company_id: data.company_id,
        files: data.files || [],
        existingImages: data.existingImages || [],
      });

      toast.success('Producto actualizado exitosamente');
      navigate(`/productos/${productId}`);
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Error actualizando el producto');
    } finally {
      setUpdating(false);
    }
  };

  const handleCancel = () => {
    navigate(`/productos/${productId}`);
  };

  if (error) {
    return (
      <Box width='100%' maxWidth='800px' mx='auto' p={3}>
        <Alert severity='error' sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Typography variant='body1'>
          No se pudieron cargar los datos del producto.
        </Typography>
      </Box>
    );
  }

  return (
    <Box width='100%' maxWidth='800px' mx='auto' p={3}>
      <Typography variant='h4' mb={3} fontWeight='bold'>
        Editar Producto
      </Typography>

      {product && (
        <Typography variant='body1' color='text.secondary' mb={3}>
          Editando: <strong>{product.product_name}</strong>
        </Typography>
      )}

      <UnifiedProductForm
        mode='edit'
        onSubmit={handleUpdateProduct}
        onCancel={handleCancel}
        initialData={initialFormData || undefined}
        existingImages={existingImages}
        loading={loading || updating}
        submitButtonText={updating ? 'Actualizando...' : 'Actualizar Producto'}
        showCancelButton={true}
      />
    </Box>
  );
};

export default EditProductPage;