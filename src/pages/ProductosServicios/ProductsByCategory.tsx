import { FC, useEffect, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { AppDispatch, RootState } from '../../store/store';
import { fetchProductsByCategoryId } from '../../store/products/productsThunks';
import { clearProductsData } from '../../store/products/productsSliceFinal';
import {
  Box,
  IconButton,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  Skeleton,
  Theme,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { Info } from '@mui/icons-material';

const ProductsByCategory: FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { byCategory, loading, error } = useSelector(
    (state: RootState) => state.products
  );

  const isSm = useMediaQuery((theme: Theme) => theme.breakpoints.up('sm'));
  const isMd = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'));
  const isLg = useMediaQuery((theme: Theme) => theme.breakpoints.up('lg'));

  const cols = useMemo(() => {
    if (isLg) return 5;
    if (isMd) return 4;
    if (isSm) return 2;
    return 1;
  }, [isLg, isMd, isSm]);

  useEffect(() => {
    if (!categoryId) return;
    dispatch(fetchProductsByCategoryId(parseInt(categoryId, 10)));

    return () => {
      dispatch(clearProductsData());
    };
  }, [categoryId, dispatch]);

  const handleProductClick = useCallback(
    (productId: number) => {
      navigate(`/productos/${productId}`);
    },
    [navigate]
  );

  const items = byCategory?.items?.[0]?.products || [];

  if (loading) {
    return (
      <Box width='100%' p={2}>
        <ImageList cols={cols} gap={8}>
          {Array.from({ length: 8 }).map((_, idx) => (
            <ImageListItem key={idx}>
              <Skeleton variant='rectangular' width='100%' height={200} />
            </ImageListItem>
          ))}
        </ImageList>
      </Box>
    );
  }

  if (error) {
    return (
      <Typography color='error' p={2}>
        {error}
      </Typography>
    );
  }

  return (
    <Box width='100%' p={2}>
      <ImageList
        cols={cols}
        sx={{ width: '100%', gap: { xs: 4, sm: 8, md: 12, lg: 16 } }}
      >
        {items.map((item) => {
          const placeholderImage = `https://placehold.co/600x400?text=${encodeURIComponent(item.product_name)}`;
          const productImage = item.images?.[0]
            ? `${import.meta.env.VITE_BASE_FILES_URL}${item.images[0].url}`
            : placeholderImage;

          return (
            <ImageListItem
              key={item.id}
              onClick={() => handleProductClick(item.id)}
              sx={{
                cursor: 'pointer',
                '&:hover img': {
                  opacity: 0.85,
                  transition: 'opacity 0.3s ease',
                },
              }}
            >
              <img
                src={productImage}
                alt={item.product_name}
                loading='lazy'
                onError={(e) => {
                  (e.target as HTMLImageElement).src = placeholderImage;
                }}
                style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
              />
              <ImageListItemBar
                title={item.product_name}
                subtitle={item.company.name}
                actionIcon={
                  <IconButton
                    sx={{ color: 'rgba(255, 255, 255, 0.8)' }}
                    aria-label={`info about ${item.product_name}`}
                  >
                    <Info />
                  </IconButton>
                }
              />
            </ImageListItem>
          );
        })}
      </ImageList>
    </Box>
  );
};

export default ProductsByCategory;
