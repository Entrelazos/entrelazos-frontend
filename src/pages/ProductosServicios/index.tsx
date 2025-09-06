import {
  ImageListItem,
  ImageListItemBar,
  IconButton,
  ImageList,
  Box,
  useMediaQuery,
  TextField,
  Icon,
  InputAdornment,
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import { AppDispatch, RootState } from '../../store/store';
import { useDispatch, useSelector } from 'react-redux';
import { FC, useEffect, useState } from 'react';
import { fetchCategories } from '../../store/categories/categoriesThunks';
import { Link } from 'react-router-dom';
import { Search } from '@mui/icons-material';
import { fetchAllProducts } from '../../store/products/productsThunks';

const ProductosServicios: FC = () => {
  // Media queries for responsive grid layout
  const isExtraSmallScreen = useMediaQuery('(max-width:400px)');
  const isSmallScreen = useMediaQuery(
    '(min-width:401px) and (max-width:600px)'
  );
  const isMediumScreen = useMediaQuery(
    '(min-width:601px) and (max-width:960px)'
  );

  const dispatch = useDispatch<AppDispatch>();

  // Categories state
  const {
    data: categoryData,
    loading: catLoading,
    error: catError,
  } = useSelector((state: RootState) => state.categories);

  // Products state
  const {
    data: products,
    loading: prodLoading,
    error: productError,
  } = useSelector((state: RootState) => state.products.all);

  // Search term with debounce
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 800);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  const handleSearchInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchTerm(event.target.value);
  };

  // Fetch products when search term changes
  useEffect(() => {
    if (debouncedSearchTerm) {
      dispatch(
        fetchAllProducts({
          page: 1,
          limit: 10,
          search: debouncedSearchTerm,
        })
      );
    }
  }, [debouncedSearchTerm, dispatch]);

  // Fetch categories on load
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  // Column layout based on screen size
  let cols = 5;
  if (isExtraSmallScreen) cols = 1;
  else if (isSmallScreen) cols = 2;
  else if (isMediumScreen) cols = 3;

  const renderContent = () => {
    // Loading and error handling
    if (!debouncedSearchTerm && catLoading)
      return <p>Cargando categorías...</p>;
    if (debouncedSearchTerm && prodLoading) return <p>Buscando productos...</p>;
    if (!debouncedSearchTerm && catError) return <p>{catError}</p>;
    if (debouncedSearchTerm && productError) return <p>{productError}</p>;

    return (
      <Box>
        <TextField
          id='outlined-basic'
          label='Buscar Productos/Servicios'
          variant='outlined'
          value={searchTerm}
          onChange={handleSearchInputChange}
          sx={{ mb: 4 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position='start'>
                <Icon>
                  <Search />
                </Icon>
              </InputAdornment>
            ),
          }}
        />

        {!debouncedSearchTerm && categoryData && (
          <ImageList cols={cols} gap={20}>
            {categoryData.map((item) => (
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
        )}

        {debouncedSearchTerm && products?.items && products.items.length > 0 && (
          <Box width='100%' p={2}>
            {products?.items?.map((item) => (
              <h1 key={item.id}>{item.product_name}</h1>
            ))}
          </Box>
        )}

        {debouncedSearchTerm && products?.items?.length === 0 && (
          <p>No se encontraron productos.</p>
        )}
      </Box>
    );
  };

  return renderContent();
};

export default ProductosServicios;
