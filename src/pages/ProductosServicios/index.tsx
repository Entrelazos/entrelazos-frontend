import {
  ImageListItem,
  ImageListItemBar,
  IconButton,
  ImageList,
  Box,
  useMediaQuery,
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import { AppDispatch, RootState } from '../../store/store';
import { useDispatch, useSelector } from 'react-redux';
import { FC, useEffect } from 'react';
import { fetchCategories } from '../../store/categories/categoriesThunks';
import { Link } from 'react-router-dom';

const ProductosServicios: FC = () => {
  const isExtraSmallScreen = useMediaQuery('(max-width:400px)');
  const isSmallScreen = useMediaQuery(
    '(min-width:401px) and (max-width:600px)'
  );
  const isMediumScreen = useMediaQuery(
    '(min-width:601px) and (max-width:960px)'
  );
  const isLargeScreen = useMediaQuery('(min-width:961px)');

  const dispatch = useDispatch<AppDispatch>();
  const { data, loading, error } = useSelector(
    (state: RootState) => state.categories
  );

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const renderContent = () => {
    let cols = 5; // Default number of columns

    if (isExtraSmallScreen) {
      cols = 1;
    } else if (isSmallScreen) {
      cols = 2;
    } else if (isMediumScreen) {
      cols = 3;
    } else if (isLargeScreen) {
      cols = 5;
    }
    if (loading) {
      return <p>Loading...</p>;
    }

    if (error) {
      return <p>{error}</p>;
    }
    if (data) {
      return (
        <Box>
          <ImageList cols={cols} gap={20}>
            {data.map((item) => (
              <Link to={`/productos-servicios/${item.id}`} key={item.id}>
                <ImageListItem>
                  <img
                    srcSet={`/categories-icons/${item.image}`}
                    src={`/categories-icons/${item.image}`}
                    alt={item.category_name}
                    loading='lazy'
                  />
                  <ImageListItemBar
                    title={item.category_name}
                    actionIcon={
                      <IconButton
                        sx={{ color: 'rgba(255, 255, 255, 0.54)' }}
                        aria-label={`info about ${item.category_name}`}
                      >
                        <InfoIcon />
                      </IconButton>
                    }
                  />
                </ImageListItem>
              </Link>
            ))}
          </ImageList>
        </Box>
      );
    }
    return null;
  };
  return renderContent();
};
export default ProductosServicios;
