import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import CardComponent from '../../components/Card';
import Grid from '@mui/material/Unstable_Grid2';
import { fetchCompaniesData } from '../../store/companies/companiesThunks';
import { useNavigate } from 'react-router-dom';

const CompaniesPage: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { data, loading, error } = useSelector(
    (state: RootState) => state.companies
  );

  useEffect(() => {
    dispatch(fetchCompaniesData({ page: 1, limit: 10 }));
  }, [dispatch]);

  const handleCardClick = (companyId: number) => {
    navigate(`productos-servicios/${companyId}`);
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
          {data?.items.map((item) => (
            <Grid key={item.id} xs={12} md={6} lg={4}>
              <CardComponent
                title={item.name}
                content={item.description}
                image='https://placehold.co/600x400'
                onClick={() => handleCardClick(item.id)}
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
