import { FC, useEffect, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import CardComponent from '../../components/Card';
import Grid from '@mui/material/Unstable_Grid2';
import { fetchCompaniesData } from '../../store/companies/companiesThunks';
import { useNavigate } from 'react-router-dom';
import ChipsFilter, {
  FilteredCategoryItem,
} from '../../components/ChipsFilter/chips-filter.component';
import { fetchCategories } from '../../store/categories/categoriesThunks';
import {
  Box,
  TextField,
  Typography,
  InputAdornment,
  Icon,
} from '@mui/material';
import { Search } from '@mui/icons-material';
import { useState } from 'react';

const CompaniesPage: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { companiesData, loading } = useSelector(
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

  useEffect(() => {
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
        <Grid container spacing={2}>
          {companies.map((item) => {
            const placeholderImage = `https://placehold.co/600x400?text=${encodeURIComponent(item.name)}`;
            const mainImage = item?.images?.[0]?.url
              ? getImageUrl(item.images[0].url)
              : placeholderImage;

            return (
              <Grid key={item.id} xs={12} md={6} lg={4}>
                <CardComponent
                  avatarImage={getImageUrl(item?.images?.[1]?.url)} // avatar stays as it is
                  title={item.name}
                  content={item.description}
                  image={mainImage} // safe with fallback!
                  onClick={() => handleCardClick(item.name)}
                />
              </Grid>
            );
          })}
        </Grid>
      )}
    </Box>
  );
};

export default CompaniesPage;
