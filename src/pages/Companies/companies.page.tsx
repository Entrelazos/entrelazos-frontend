import { FC, useEffect, useMemo, useState } from 'react';
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

const CompaniesPage: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { uid } = useSelector((state: RootState) => state.auth);
  const { companiesData, loading } = useSelector(
    (state: RootState) => state.companies
  );
  const { data: categories } = useSelector(
    (state: RootState) => state.categories
  );

  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);

  useEffect(() => {
    if (!categories) {
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

  const onFilter = (categoryId: number) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const onClear = () => setSelectedCategories([]);

  const handleCardClick = (companyName: string) =>
    navigate(`perfil-compania/${companyName}`);

  const companies = useMemo(() => companiesData?.items || [], [companiesData]);

  return (
    <Grid container spacing={2} padding={2}>
      {categories && (
        <ChipsFilter
          categories={categories as FilteredCategoryItem[]}
          onFilter={onFilter}
          onClear={onClear}
        />
      )}

      {loading ? (
        <p>Cargando empresas...</p>
      ) : companies.length > 0 ? (
        companies.map((item) => (
          <Grid key={item.id} xs={12} md={6} lg={4}>
            <CardComponent
              avatarImage={`${import.meta.env.VITE_BASE_FILES_URL}${item?.images?.[1]?.url || ''}`}
              title={item.name}
              content={item.description}
              image={`${import.meta.env.VITE_BASE_FILES_URL}${item?.images?.[0]?.url || ''}`}
              onClick={() => handleCardClick(item.name)}
            />
          </Grid>
        ))
      ) : (
        <p>No hay empresas registradas.</p>
      )}
    </Grid>
  );
};

export default CompaniesPage;
