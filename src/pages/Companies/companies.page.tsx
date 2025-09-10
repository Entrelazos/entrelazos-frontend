import { FC, useEffect, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import CardComponent from '../../components/Card';
import { fetchCompaniesData, fetchMoreCompanies } from '../../store/companies/companiesThunks';
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
import Icon from '@mui/material/Icon';
import Grid from '@mui/material/Grid';
import { Search } from '@mui/icons-material';
import { useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';

const CompaniesPage: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { companiesData, loading, loadingMore, hasMorePages, currentPage } = useSelector(
    (state: RootState) => state.companies
  );
  const { data: categories } = useSelector(
    (state: RootState) => state.categories
  );

  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);

  const companies = useMemo(() => companiesData?.items || [], [companiesData]);

  const getImageUrl = (imagePath?: string) =>
    imagePath ? `${import.meta.env.VITE_BASE_FILES_URL}${imagePath}` : '';

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

  useEffect(() => {
    if (!categories || categories.length === 0) {
      dispatch(fetchCategories());
    }
  }, [categories, dispatch]);

  const loadMoreCompanies = useCallback(() => {
    if (!loadingMore && hasMorePages) {
      dispatch(
        fetchMoreCompanies({
          page: currentPage + 1,
          limit: 10,
          categoryIds: selectedCategories,
          search: debouncedSearchTerm,
        })
      );
    }
  }, [dispatch, currentPage, loadingMore, hasMorePages, selectedCategories, debouncedSearchTerm]);

  const { lastElementRef } = useInfiniteScroll({
    hasMorePages,
    loading: loadingMore,
    onLoadMore: loadMoreCompanies,
  });

  useEffect(() => {
    // Reset pagination when filters change
    dispatch(resetPagination());
    dispatch(
      fetchCompaniesData({
        page: 1,
        limit: 10,
        categoryIds: selectedCategories,
        search: debouncedSearchTerm,
      })
    );
  }, [selectedCategories, debouncedSearchTerm, dispatch]);

  const onFilter = useCallback((categoryId: number) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  }, []);

  const onClear = useCallback(() => {
    setSelectedCategories([]);
  }, []);

  const handleCardClick = useCallback(
    (companyName: string) => {
      navigate(`perfil-compania/${companyName}`);
    },
    [navigate]
  );

  return (
    <Box p={2}>
      {categories && (
        <Box mb={2}>
          <ChipsFilter
            categories={categories as FilteredCategoryItem[]}
            onFilter={onFilter}
            onClear={onClear}
          />
          <TextField
            id='outlined-basic'
            label='Buscar Empresas'
            variant='outlined'
            onChange={handleSearchInputChange}
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
        </Box>
      )}

      {loading ? (
        <Typography variant='body1'>Cargando empresas...</Typography>
      ) : companies.length === 0 ? (
        <Typography variant='body1'>No hay empresas registradas.</Typography>
      ) : (
        <>
          <Grid container spacing={2}>
            {companies.map((item, index) => {
              const placeholderImage = `https://placehold.co/600x400?text=${encodeURIComponent(item.name)}`;
              const mainImage = item?.images?.[0]?.url
                ? getImageUrl(item.images[0].url)
                : placeholderImage;

              const isLastItem = index === companies.length - 1;

              return (
                <Grid 
                  key={item.id} 
                  size={{ xs: 12, md: 6, lg: 4 }}
                  ref={isLastItem ? lastElementRef : null}
                >
                  <CardComponent
                    avatarImage={getImageUrl(item?.images?.[1]?.url)}
                    title={item.name}
                    content={item.description}
                    image={mainImage}
                    onClick={() => handleCardClick(item.name)}
                  />
                </Grid>
              );
            })}
          </Grid>
          
          {loadingMore && (
            <Box display="flex" justifyContent="center" mt={4}>
              <CircularProgress />
            </Box>
          )}
          
          {!hasMorePages && companies.length > 0 && (
            <Box display="flex" justifyContent="center" mt={4}>
              <Typography variant="body2" color="text.secondary">
                No hay más empresas para cargar
              </Typography>
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

export default CompaniesPage;
