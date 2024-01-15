import { ImageListItem, ImageListItemBar, IconButton, Grid } from '@mui/material';
import { Hero } from './components/Hero';
import { HomeContainer } from './styles';
import InfoIcon from '@mui/icons-material/Info';
import { CATEGORIES } from '../../constants/constants';
import { CategoryApiResponse } from '../../types/categories/CategoryTypes';
import { AppDispatch } from '../../store/store';
import { useDispatch, useSelector } from 'react-redux';
import { FC, useEffect } from 'react';
import { fetchCategories } from '../../store/categories/categoriesThunks';

interface RootState {
  categories: {
    data: CategoryApiResponse | null;
    loading: boolean;
    error: string | null;
  };
}

const ProductosServicios: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { data, loading, error } = useSelector(
    (state: RootState) => state.categories
  );

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const renderContent = () => {

    if (loading) {
      return <p>Loading...</p>;
    }

    if (error) {
      return <p>{error}</p>;
    }
    if (data) {
      return (
        <HomeContainer>
          <Hero />
          <Grid container spacing={2} padding={2} gap={4} width='100%' margin={0} justifyContent='center'>
            {CATEGORIES.map((item) => (
              <Grid key={item.image} xs={4} sm={3} md={2} lg={1} item>
                <ImageListItem
                  key={item.image}
                >
                  <img
                    srcSet={`/categories-icons/${item.image}`}
                    src={`/categories-icons/${item.image}`}
                    alt={item.name}
                    loading="lazy"
                  />
                  <ImageListItemBar
                    title={item.name}
                    actionIcon={
                      <IconButton
                        sx={{ color: 'rgba(255, 255, 255, 0.54)' }}
                        aria-label={`info about ${item.name}`}
                      >
                        <InfoIcon />
                      </IconButton>
                    }
                  />
                </ImageListItem>
              </Grid>
            ))}
          </Grid>
        </HomeContainer>
      );
    }
    return null;
  };
  return renderContent();
};
export default ProductosServicios;
