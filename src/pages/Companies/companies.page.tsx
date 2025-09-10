import React, { FC, useEffect, useMemo, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { CompanyItem } from '../../types/companies/CompaniesTypes';
import CardComponent from '../../components/Card';
import {
  fetchCompaniesData,
  fetchMoreCompanies,
} from '../../store/companies/companiesThunks';
import { resetPagination } from '../../store/companies/companiesSlice';
import { useInfiniteScroll } from '../../hooks/useInfiniteScroll';
import { useNavigate } from 'react-router-dom';
import ChipsFilter, {
  FilteredCategoryItem,
} from '../../components/ChipsFilter/chips-filter.component';
import { fetchCategories } from '../../store/categories/categoriesThunks';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Skeleton from '@mui/material/Skeleton';
import Container from '@mui/material/Container';
import { Search, Clear } from '@mui/icons-material';
import { toast } from 'react-toastify';

// Constants
const DEBOUNCE_DELAY = 800;
const COMPANIES_PER_PAGE = 10;
const SEARCH_PLACEHOLDER = 'Buscar empresas por nombre...';

// Local interfaces

interface SearchFieldProps {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
  disabled?: boolean;
}

// Custom hook for search debouncing
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Custom hook for image URL generation
const useImageUrl = () => {
  const getImageUrl = useCallback((imagePath?: string) => {
    return imagePath
      ? `${import.meta.env.VITE_BASE_FILES_URL}${imagePath}`
      : '';
  }, []);

  const getPlaceholderImage = useCallback((companyName: string) => {
    return `https://placehold.co/600x400?text=${encodeURIComponent(companyName)}`;
  }, []);

  return { getImageUrl, getPlaceholderImage };
};

// Search Field Component
const SearchField: React.FC<SearchFieldProps> = ({
  value,
  onChange,
  onClear,
  disabled = false,
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };

  const handleClear = () => {
    onClear();
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      handleClear();
    }
  };

  return (
    <TextField
      fullWidth
      id='company-search'
      label='Buscar Empresas'
      variant='outlined'
      value={value}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      disabled={disabled}
      placeholder={SEARCH_PLACEHOLDER}
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position='start'>
              <Search aria-hidden='true' />
            </InputAdornment>
          ),
          endAdornment: value && (
            <InputAdornment position='end'>
              <IconButton
                aria-label='Limpiar búsqueda'
                onClick={handleClear}
                disabled={disabled}
                size='small'
              >
                <Clear />
              </IconButton>
            </InputAdornment>
          ),
        },
      }}
      aria-describedby='search-help'
    />
  );
};

// Loading Skeleton Component
const CompanyCardSkeleton: React.FC = () => (
  <Box>
    <Skeleton variant='rectangular' width='100%' height={194} />
    <Box p={2}>
      <Skeleton variant='text' width='80%' height={32} />
      <Skeleton variant='text' width='100%' />
      <Skeleton variant='text' width='60%' />
    </Box>
  </Box>
);

// Loading Grid Component
const LoadingGrid: React.FC<{ count?: number }> = ({ count = 6 }) => (
  <Box
    sx={{
      display: 'grid',
      gridTemplateColumns: { xs: '1fr', md: '1fr 1fr', lg: '1fr 1fr 1fr' },
      gap: 2,
    }}
  >
    {Array.from({ length: count }, (_, index) => (
      <CompanyCardSkeleton key={index} />
    ))}
  </Box>
);

// Empty State Component
const EmptyState: React.FC<{ hasFilters: boolean; searchTerm: string }> = ({
  hasFilters,
  searchTerm,
}) => (
  <Box
    sx={{
      textAlign: 'center',
      py: 8,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 2,
    }}
  >
    <Typography variant='h6' color='text.secondary'>
      {searchTerm
        ? 'No se encontraron empresas'
        : 'No hay empresas registradas'}
    </Typography>
    <Typography variant='body2' color='text.secondary'>
      {searchTerm
        ? `No hay resultados para "${searchTerm}"`
        : hasFilters
          ? 'Intenta ajustar los filtros de categoría'
          : 'Aún no se han registrado empresas en el sistema'}
    </Typography>
  </Box>
);

// Error State Component
const ErrorState: React.FC<{ onRetry: () => void }> = ({ onRetry }) => (
  <Alert
    severity='error'
    action={
      <IconButton
        aria-label='Reintentar'
        color='inherit'
        size='small'
        onClick={onRetry}
      >
        Reintentar
      </IconButton>
    }
    sx={{ mb: 2 }}
  >
    Error al cargar las empresas. Por favor, inténtalo de nuevo.
  </Alert>
);

// Main Component
const CompaniesPage: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const {
    companiesData,
    loading,
    loadingMore,
    hasMorePages,
    currentPage,
    error,
  } = useSelector((state: RootState) => state.companies);

  const { data: categories, loading: categoriesLoading } = useSelector(
    (state: RootState) => state.categories
  );

  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const debouncedSearchTerm = useDebounce(searchTerm, DEBOUNCE_DELAY);
  const { getImageUrl, getPlaceholderImage } = useImageUrl();

  const companies = useMemo(() => companiesData?.items || [], [companiesData]);

  // Load categories on mount
  useEffect(() => {
    if (!categories || categories.length === 0) {
      dispatch(fetchCategories()).catch((error) => {
        console.error('Failed to load categories:', error);
        toast.error('Error al cargar las categorías');
      });
    }
  }, [categories, dispatch]);

  // Load more companies callback
  const loadMoreCompanies = useCallback(() => {
    if (!loadingMore && hasMorePages) {
      dispatch(
        fetchMoreCompanies({
          page: currentPage + 1,
          limit: COMPANIES_PER_PAGE,
          categoryIds: selectedCategories,
          search: debouncedSearchTerm,
        })
      ).catch((error) => {
        console.error('Failed to load more companies:', error);
        toast.error('Error al cargar más empresas');
      });
    }
  }, [
    dispatch,
    currentPage,
    loadingMore,
    hasMorePages,
    selectedCategories,
    debouncedSearchTerm,
  ]);

  // Infinite scroll hook
  const { lastElementRef } = useInfiniteScroll({
    hasMorePages,
    loading: loadingMore,
    onLoadMore: loadMoreCompanies,
  });

  // Fetch companies when filters change
  useEffect(() => {
    dispatch(resetPagination());
    dispatch(
      fetchCompaniesData({
        page: 1,
        limit: COMPANIES_PER_PAGE,
        categoryIds: selectedCategories,
        search: debouncedSearchTerm,
      })
    ).catch((error) => {
      console.error('Failed to fetch companies:', error);
      toast.error('Error al cargar las empresas');
    });
  }, [selectedCategories, debouncedSearchTerm, dispatch]);

  // Filter handlers
  const handleFilter = useCallback((categoryId: number) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  }, []);

  const handleClearFilters = useCallback(() => {
    setSelectedCategories([]);
  }, []);

  // Search handlers
  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
  }, []);

  const handleSearchClear = useCallback(() => {
    setSearchTerm('');
  }, []);

  // Navigation handler
  const handleCardClick = useCallback(
    (companyName: string) => {
      navigate(`perfil-compania/${companyName}`);
    },
    [navigate]
  );

  // Retry handler
  const handleRetry = useCallback(() => {
    dispatch(resetPagination());
    dispatch(
      fetchCompaniesData({
        page: 1,
        limit: COMPANIES_PER_PAGE,
        categoryIds: selectedCategories,
        search: debouncedSearchTerm,
      })
    );
  }, [dispatch, selectedCategories, debouncedSearchTerm]);

  const hasFilters = selectedCategories.length > 0;
  const isInitialLoading = loading && companies.length === 0;

  return (
    <Container maxWidth='lg'>
      <Box p={2}>
        {/* Header */}
        <Box mb={4}>
          <Typography
            variant='h4'
            component='h1'
            gutterBottom
            sx={{ fontWeight: 'bold' }}
          >
            Empresas
          </Typography>
          <Typography variant='body1' color='text.secondary'>
            Descubre empresas y conoce sus servicios
          </Typography>
        </Box>

        {/* Filters and Search */}
        {(categories || categoriesLoading) && (
          <Box mb={3} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {categoriesLoading ? (
              <Skeleton variant='rectangular' width='100%' height={56} />
            ) : (
              <ChipsFilter
                categories={categories as FilteredCategoryItem[]}
                onFilter={handleFilter}
                onClear={handleClearFilters}
              />
            )}

            <SearchField
              value={searchTerm}
              onChange={handleSearchChange}
              onClear={handleSearchClear}
              disabled={isInitialLoading}
            />

            <Typography
              id='search-help'
              variant='caption'
              color='text.secondary'
              sx={{ mt: 0.5 }}
            >
              Presiona Escape para limpiar la búsqueda
            </Typography>
          </Box>
        )}

        {/* Error State */}
        {error && <ErrorState onRetry={handleRetry} />}

        {/* Content */}
        {isInitialLoading ? (
          <LoadingGrid />
        ) : companies.length === 0 ? (
          <EmptyState
            hasFilters={hasFilters}
            searchTerm={debouncedSearchTerm}
          />
        ) : (
          <>
            {/* Results Summary */}
            <Box mb={2}>
              <Typography variant='body2' color='text.secondary'>
                {companies.length} empresa{companies.length !== 1 ? 's' : ''}{' '}
                encontrada{companies.length !== 1 ? 's' : ''}
                {(hasFilters || debouncedSearchTerm) && (
                  <span> con los filtros aplicados</span>
                )}
              </Typography>
            </Box>

            {/* Companies Grid */}
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  md: '1fr 1fr',
                  lg: '1fr 1fr 1fr',
                },
                gap: 3,
                mb: 4,
              }}
            >
              {companies.map((company: CompanyItem, index: number) => {
                const placeholderImage = getPlaceholderImage(company.name);
                const mainImage = company?.images?.[0]?.url
                  ? getImageUrl(company.images[0].url)
                  : placeholderImage;

                const isLastItem = index === companies.length - 1;

                return (
                  <Box
                    key={company.id}
                    ref={isLastItem ? lastElementRef : null}
                  >
                    <CardComponent
                      avatarImage={getImageUrl(company?.images?.[1]?.url)}
                      title={company.name}
                      content={company.description}
                      image={mainImage}
                      onClick={() => handleCardClick(company.name)}
                    />
                  </Box>
                );
              })}
            </Box>

            {/* Loading More Indicator */}
            {loadingMore && (
              <Box
                display='flex'
                justifyContent='center'
                alignItems='center'
                py={4}
                role='status'
                aria-label='Cargando más empresas'
              >
                <CircularProgress size={32} />
                <Typography
                  variant='body2'
                  color='text.secondary'
                  sx={{ ml: 2 }}
                >
                  Cargando más empresas...
                </Typography>
              </Box>
            )}

            {/* End of Results */}
            {!hasMorePages && companies.length > 0 && (
              <Box display='flex' justifyContent='center' py={4}>
                <Typography variant='body2' color='text.secondary'>
                  Has visto todas las empresas disponibles
                </Typography>
              </Box>
            )}
          </>
        )}
      </Box>
    </Container>
  );
};

export default CompaniesPage;
