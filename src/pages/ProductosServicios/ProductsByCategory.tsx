import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { AppDispatch, RootState } from '../../store/store';
import { fetchProductsByCategoryId } from '../../store/products/productsThunks';
import {
  IconButton,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  Theme,
  useMediaQuery,
} from '@mui/material';
import { Info } from '@mui/icons-material';
import { clearProductsData } from '../../store/products/productsSliceFinal';

const ProductsByCategory: FC = () => {
  const { categoryId } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const { byCategory, loading, error } = useSelector(
    (state: RootState) => state.products
  );
  const navigate = useNavigate();

  const isSm = useMediaQuery((theme: Theme) => theme.breakpoints.up('sm'));
  const isMd = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'));
  const isLg = useMediaQuery((theme: Theme) => theme.breakpoints.up('lg'));

  // Determine the number of columns based on breakpoints
  let cols = 1; // Default for extra-small screens
  if (isLg) cols = 5;
  else if (isMd) cols = 4;
  else if (isSm) cols = 2;

  useEffect(() => {
    dispatch(fetchProductsByCategoryId(parseInt(categoryId)));
    return () => {
      dispatch(clearProductsData());
    };
  }, [dispatch]);

  const handleProductClick = (productId: number) => {
    navigate(`/productos/${productId}`);
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }
  if (byCategory) {
    const { items, meta } = byCategory || {
      items: [],
      meta: { currentPage: 1, itemsPerPage: 10 },
    };

    return (
      <ImageList
        sx={{
          width: '100%',
          gap: {
            xs: 4, // Smaller gap on extra-small screens
            sm: 8, // Medium gap on small screens
            md: 12, // Larger gap on medium screens
            lg: 16, // Largest gap on large screens
          },
        }}
        cols={cols} // Set columns responsively
      >
        {items[0]?.products?.map((item) => (
          <ImageListItem
            key={item.id}
            onClick={() => handleProductClick(item.id)}
          >
            <img
              srcSet={item.images[0]}
              src={item.images[0]}
              alt={item.product_name}
              loading='lazy'
            />
            <ImageListItemBar
              title={item.product_name}
              subtitle={item.company.name}
              actionIcon={
                <IconButton
                  sx={{ color: 'rgba(255, 255, 255, 0.54)' }}
                  aria-label={`info about ${item.product_name}`}
                >
                  <Info />
                </IconButton>
              }
            />
          </ImageListItem>
        ))}
      </ImageList>
    );
  }
};
export default ProductsByCategory;
