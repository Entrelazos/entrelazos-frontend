import { FC, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import CardComponent from '../../components/Card';
import Grid from '@mui/material/Unstable_Grid2';
import { fetchCompaniesData } from '../../store/companies/companiesThunks';
import { useNavigate } from 'react-router-dom';
import ChipsFilter from '../../components/ChipsFilter/chips-filter.component';
import { fetchCategories } from '../../store/categories/categoriesThunks';

const CompaniesPage: FC = () => {
  const [selectedCategories, setSelectedCategories] = useState([]);

  const onFilter = (categoryId: number) => {
    if (!selectedCategories.includes(categoryId)) {
      setSelectedCategories([...selectedCategories, categoryId]);
    }
  };

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { data, loading, error } = useSelector(
    (state: RootState) => state.companies
  );

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const { data: categories } = useSelector(
    (state: RootState) => state.categories
  );

  useEffect(() => {
    dispatch(
      fetchCompaniesData({
        page: 1,
        limit: 10,
        categoryIds: selectedCategories,
      })
    );
  }, [dispatch, selectedCategories]);

  const handleCardClick = (companyName: string) => {
    navigate(`perfil-compania/${companyName}`);
  };

  const renderContent = () => {
    if (loading) {
      return <p>Loading...</p>;
    }

    if (error) {
      return <p>{error}</p>;
    }

    if (data) {
      return (
        <Grid container spacing={2} padding={2}>
          <ChipsFilter categories={categories} onFilter={onFilter} />
          {data?.items.map((item) => (
            <Grid key={item.id} xs={12} md={6} lg={4}>
              <CardComponent
                title={item.name}
                content={item.description}
                image='https://placehold.co/600x400'
                onClick={() => handleCardClick(item.name)}
              ></CardComponent>
            </Grid>
          ))}
        </Grid>
      );
    }

    return null;
  };

  return renderContent();
};

export default CompaniesPage;
