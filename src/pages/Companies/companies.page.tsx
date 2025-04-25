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
import { Box, Typography } from '@mui/material';
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
      })
    );
  }, [selectedCategories, dispatch]);

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
        </Box>
      )}

      {loading ? (
        <Typography variant='body1'>Cargando empresas...</Typography>
      ) : companies.length === 0 ? (
        <Typography variant='body1'>No hay empresas registradas.</Typography>
      ) : (
        <Grid container spacing={2}>
          {companies.map((item) => (
            <Grid key={item.id} xs={12} md={6} lg={4}>
              <CardComponent
                avatarImage={getImageUrl(item?.images?.[1]?.url)}
                title={item.name}
                content={item.description}
                image={getImageUrl(item?.images?.[0]?.url)}
                onClick={() => handleCardClick(item.name)}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default CompaniesPage;
