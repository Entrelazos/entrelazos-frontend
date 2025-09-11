import React, { memo } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Stack,
  Divider,
  IconButton,
} from '@mui/material';
import { Edit, Delete, Visibility, VisibilityOff } from '@mui/icons-material';
import { ProductListItem as ProductListItemType } from '../../../types/product-form/ProductFormTypes';

interface ProductListItemProps {
  product: ProductListItemType;
  index: number;
  onEdit: (index: number) => void;
  onDelete: (index: number) => void;
  categories?: any[];
}

const ProductListItem: React.FC<ProductListItemProps> = memo(
  ({ product, index, onEdit, onDelete, categories }) => {
    const handleDelete = () => {
      if (
        window.confirm('¿Estás seguro de que quieres eliminar este producto?')
      ) {
        onDelete(index);
      }
    };

    const getCategoryNames = (categoryIds: number[]): string => {
      if (!categories) return 'Sin categorías';

      const categoryNames = categoryIds
        .map((id) => {
          const category = categories.find((cat) => cat.id === id);
          return category?.category_name || 'Desconocida';
        })
        .filter(Boolean);

      return categoryNames.length > 0
        ? categoryNames.join(', ')
        : 'Sin categorías';
    };

    const formatPrice = (price: string | number): string => {
      const numPrice = typeof price === 'string' ? parseFloat(price) : price;
      return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
      }).format(numPrice);
    };

    return (
      <Card
        elevation={2}
        sx={{
          transition: 'all 0.2s',
          '&:hover': {
            elevation: 4,
            transform: 'translateY(-2px)',
          },
        }}
      >
        <CardContent>
          <Stack spacing={2}>
            {/* Header with title and actions */}
            <Box
              display='flex'
              justifyContent='space-between'
              alignItems='flex-start'
            >
              <Typography variant='h6' component='h3' gutterBottom>
                {product.product_name}
              </Typography>
              <Stack direction='row' spacing={1}>
                <IconButton
                  size='small'
                  onClick={() => onEdit(index)}
                  color='primary'
                  aria-label='Editar producto'
                >
                  <Edit fontSize='small' />
                </IconButton>
                <IconButton
                  size='small'
                  onClick={handleDelete}
                  color='error'
                  aria-label='Eliminar producto'
                >
                  <Delete fontSize='small' />
                </IconButton>
              </Stack>
            </Box>

            {/* Product description */}
            <Box>
              <Typography variant='body2' color='text.secondary' gutterBottom>
                Descripción:
              </Typography>
              <Typography
                variant='body2'
                sx={{
                  maxHeight: '3em',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                }}
                dangerouslySetInnerHTML={{ __html: product.productDescription }}
              />
            </Box>

            <Divider />

            {/* Product details */}
            <Box display='flex' flexWrap='wrap' gap={2}>
              <Box display='flex' alignItems='center' gap={1}>
                <Typography variant='body2' fontWeight='medium'>
                  Precio:
                </Typography>
                <Typography
                  variant='body2'
                  color='primary.main'
                  fontWeight='bold'
                >
                  {formatPrice(product.price)}
                </Typography>
              </Box>

              <Box display='flex' alignItems='center' gap={1}>
                <Typography variant='body2' fontWeight='medium'>
                  Tipo:
                </Typography>
                <Chip
                  label={product.is_service ? 'Servicio' : 'Producto'}
                  size='small'
                  color={product.is_service ? 'secondary' : 'primary'}
                  variant='outlined'
                />
              </Box>

              <Box display='flex' alignItems='center' gap={1}>
                <Typography variant='body2' fontWeight='medium'>
                  Visibilidad:
                </Typography>
                <Chip
                  icon={product.is_public ? <Visibility /> : <VisibilityOff />}
                  label={product.is_public ? 'Público' : 'Privado'}
                  size='small'
                  color={product.is_public ? 'success' : 'default'}
                  variant='outlined'
                />
              </Box>
            </Box>

            {/* Categories */}
            <Box>
              <Typography variant='body2' color='text.secondary' gutterBottom>
                Categorías:
              </Typography>
              <Typography variant='body2'>
                {getCategoryNames(product.category_ids)}
              </Typography>
            </Box>

            {/* Files */}
            {product.files && product.files.length > 0 && (
              <Box>
                <Typography variant='body2' color='text.secondary' gutterBottom>
                  Archivos adjuntos:
                </Typography>
                <Typography variant='body2'>
                  {product.files.length} archivo
                  {product.files.length !== 1 ? 's' : ''}
                </Typography>
              </Box>
            )}

            {/* Creation date */}
            {product.createdAt && (
              <Box>
                <Typography variant='caption' color='text.disabled'>
                  Agregado: {product.createdAt.toLocaleDateString('es-CO')} a
                  las{' '}
                  {product.createdAt.toLocaleTimeString('es-CO', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Typography>
              </Box>
            )}
          </Stack>
        </CardContent>
      </Card>
    );
  }
);

ProductListItem.displayName = 'ProductListItem';

export default ProductListItem;
