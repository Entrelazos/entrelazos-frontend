import {
  ImageListItem,
  ImageListItemBar,
  IconButton,
  ImageList,
  Box,
  useMediaQuery,
  TextField,
  InputAdornment,
  Typography,
  CircularProgress,
  Alert,
  Container,
  useTheme,
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import SearchIcon from '@mui/icons-material/Search';
import { AppDispatch, RootState } from '../../store/store';
import { useDispatch, useSelector } from 'react-redux';
import { FC, useEffect, useState, useCallback, useMemo } from 'react';
import { fetchCategories } from '../../store/categories/categoriesThunks';
import { Link } from 'react-router-dom';
import { fetchAllProducts } from '../../store/products/productsThunks';
import { CategoryItem } from '../../types/categories/CategoryTypes';
import { ProductItem } from '../../types/products/ProductsTypes';

interface CategoryGridProps {
  categories: CategoryItem[];
  columns: number;
}

interface ProductListProps {
  products: ProductItem[];
}

interface LoadingStateProps {
  message: string;
}

interface ErrorStateProps {
  error: string;
}

// Memoized CategoryGrid component
const CategoryGrid: FC<CategoryGridProps> = ({ categories, columns }) => (
  <ImageList cols={columns} gap={20} sx={{ margin: 0 }}>
    {categories.map((item) => (
      <Link
        to={`/productos-servicios/${item.id}`}
        key={item.id}
        style={{ textDecoration: 'none' }}
        tabIndex={0}
        role='button'
        aria-label={`Ver productos de la categoría ${item.category_name}`}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            e.currentTarget.click();
          }
        }}
      >
        <ImageListItem
          sx={{
            cursor: 'pointer',
            '&:hover': {
              transform: 'translateY(-4px)',
              transition: 'transform 0.2s ease-in-out',
            },
            '&:focus-within': {
              outline: '2px solid',
              outlineColor: 'primary.main',
              outlineOffset: '2px',
            },
          }}
        >
          <img
            srcSet={`/categories-icons/${item.image}`}
            src={`/categories-icons/${item.image}`}
            alt=''
            loading='lazy'
            style={{
              height: '160px',
              width: '100%',
              objectFit: 'contain',
              borderRadius: '8px',
              padding: '8px',
            }}
          />
          <ImageListItemBar
            title={item.category_name}
            sx={{
              borderBottomLeftRadius: '8px',
              borderBottomRightRadius: '8px',
            }}
            actionIcon={
              <IconButton
                sx={{ color: 'rgba(255, 255, 255, 0.54)' }}
                aria-hidden='true'
                tabIndex={-1}
              >
                <InfoIcon />
              </IconButton>
            }
          />
        </ImageListItem>
      </Link>
    ))}
  </ImageList>
);

// Memoized ProductList component
const ProductList: FC<ProductListProps> = ({ products }) => (
  <Box sx={{ width: '100%' }}>
    {products.map((item) => (
      <Box
        key={item.id}
        sx={{
          p: 2,
          mb: 2,
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 2,
          '&:hover': {
            backgroundColor: 'action.hover',
          },
        }}
        role='listitem'
        tabIndex={0}
        aria-label={`Producto: ${item.product_name}`}
      >
        <Typography variant='h6' component='h3' sx={{ mb: 1 }}>
          {item.product_name}
        </Typography>
        {item.product_description && (
          <Typography variant='body2' color='text.secondary' sx={{ mb: 1 }}>
            {item.product_description}
          </Typography>
        )}
        {item.price && (
          <Typography variant='body1' color='primary' fontWeight='bold'>
            ${item.price}
          </Typography>
        )}
        {item.company?.name && (
          <Typography variant='caption' color='text.secondary'>
            Por {item.company.name}
          </Typography>
        )}
      </Box>
    ))}
  </Box>
);

// Memoized LoadingState component
const LoadingState: FC<LoadingStateProps> = ({ message }) => (
  <Box display='flex' justifyContent='center' alignItems='center' py={4}>
    <CircularProgress size={24} sx={{ mr: 2 }} />
    <Typography>{message}</Typography>
  </Box>
);

// Memoized ErrorState component
const ErrorState: FC<ErrorStateProps> = ({ error }) => (
  <Alert severity='error' sx={{ mt: 2 }}>
    {error}
  </Alert>
);

const ProductosServicios: FC = () => {
  const theme = useTheme();

  // Media queries for responsive grid layout
  const isExtraSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const isSmallScreen = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const isMediumScreen = useMediaQuery(theme.breakpoints.between('md', 'lg'));

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

  // Debounced search effect
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm.trim());
    }, 500); // Reduced debounce time for better UX

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  // Memoized search input change handler
  const handleSearchInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(event.target.value);
    },
    []
  );

  // Fetch products when search term changes
  useEffect(() => {
    if (debouncedSearchTerm) {
      dispatch(
        fetchAllProducts({
          page: 1,
          limit: 20, // Increased limit for better results
          search: debouncedSearchTerm,
        })
      );
    }
  }, [debouncedSearchTerm, dispatch]);

  // Fetch categories on component mount
  useEffect(() => {
    if (!categoryData) {
      dispatch(fetchCategories());
    }
  }, [dispatch, categoryData]);

  // Memoized column calculation for responsive grid
  const columns = useMemo(() => {
    if (isExtraSmallScreen) return 1;
    if (isSmallScreen) return 2;
    if (isMediumScreen) return 3;
    return 4; // Better layout for larger screens
  }, [isExtraSmallScreen, isSmallScreen, isMediumScreen]);

  // Memoized categories to prevent unnecessary re-renders
  const memoizedCategories = useMemo(() => categoryData || [], [categoryData]);

  // Memoized products to prevent unnecessary re-renders
  const memoizedProducts = useMemo(
    () => products?.items || [],
    [products?.items]
  );

  // Loading state logic
  const isLoadingCategories = !debouncedSearchTerm && catLoading;
  const isLoadingProducts = debouncedSearchTerm && prodLoading;
  const isLoading = isLoadingCategories || isLoadingProducts;

  // Error state logic
  const categoryError = !debouncedSearchTerm && catError;
  const searchError = debouncedSearchTerm && productError;
  const currentError = categoryError || searchError;

  // Show empty search results
  const showNoResults =
    debouncedSearchTerm && !isLoadingProducts && memoizedProducts.length === 0;

  // Show categories
  const showCategories =
    !debouncedSearchTerm &&
    memoizedCategories.length > 0 &&
    !isLoadingCategories;

  // Show products
  const showProducts =
    debouncedSearchTerm && memoizedProducts.length > 0 && !isLoadingProducts;

  return (
    <Container maxWidth='xl' sx={{ py: 4 }}>
      <Box>
        {/* Search Input */}
        <TextField
          id='product-search'
          label='Buscar Productos/Servicios'
          variant='outlined'
          value={searchTerm}
          onChange={handleSearchInputChange}
          fullWidth
          sx={{ mb: 4 }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position='start'>
                  <SearchIcon aria-hidden='true' />
                </InputAdornment>
              ),
              'aria-label': 'Buscar productos y servicios',
              'aria-describedby': 'search-help-text',
            },
          }}
          placeholder='Introduce el nombre del producto o servicio...'
        />
        <Typography
          id='search-help-text'
          variant='caption'
          color='text.secondary'
          sx={{ display: 'block', mb: 2, ml: 1 }}
        >
          Busca productos y servicios por nombre. Los resultados aparecerán
          mientras escribes.
        </Typography>

        {/* Loading States */}
        {isLoading && (
          <Box role='status' aria-live='polite'>
            <LoadingState
              message={
                isLoadingCategories
                  ? 'Cargando categorías...'
                  : 'Buscando productos...'
              }
            />
          </Box>
        )}

        {/* Error States */}
        {currentError && <ErrorState error={currentError} />}

        {/* Categories Grid */}
        {showCategories && (
          <Box role='main' aria-label='Categorías de productos y servicios'>
            <Typography
              variant='h2'
              component='h1'
              sx={{ mb: 3, fontSize: '1.5rem' }}
            >
              Categorías de Productos y Servicios
            </Typography>
            <CategoryGrid categories={memoizedCategories} columns={columns} />
          </Box>
        )}

        {/* Products List */}
        {showProducts && (
          <Box role='main' aria-label='Resultados de búsqueda'>
            <Typography
              variant='h2'
              component='h1'
              sx={{ mb: 3, fontSize: '1.5rem' }}
            >
              Resultados de búsqueda para "{debouncedSearchTerm}"
            </Typography>
            <Typography variant='body2' color='text.secondary' sx={{ mb: 2 }}>
              Se encontraron {memoizedProducts.length} productos
            </Typography>
            <ProductList products={memoizedProducts} />
          </Box>
        )}

        {/* No Results */}
        {showNoResults && (
          <Box textAlign='center' py={4}>
            <Typography variant='h6' color='text.secondary'>
              No se encontraron productos con el término "{debouncedSearchTerm}"
            </Typography>
            <Typography variant='body2' color='text.secondary' sx={{ mt: 1 }}>
              Intenta con otros términos de búsqueda
            </Typography>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default ProductosServicios;
