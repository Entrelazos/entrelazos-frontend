import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import companyService from '../../services/companies/companyService';
import { fetchApiData } from '../../store/api/thunks';
import { AppDispatch } from '../../store/store';
import { CompanyApiResponse } from '../../types/api/ApiTypes';
import CardComponent from '../../components/Card';
import Grid from '@mui/material/Unstable_Grid2';
import { Container } from '@mui/material';

interface RootState {
  api: {
    data: CompanyApiResponse | null;
    loading: boolean;
    error: string | null;
  };
}

const CompaniesPage: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { data, loading, error } = useSelector((state: RootState) => state.api);

  useEffect(() => {
    const fetchData = async () => {
      dispatch(fetchApiData({ apiService: companyService, method: 'GET', data: null }));
    };
    fetchData();
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
        <Container maxWidth="xl">
          <Grid container spacing={2} padding={2}>
            {data?.items.map((item) => (
              <Grid key={item.id} xs={12} md={6} lg={4}>
                <CardComponent title={item.name} content={item.description} image='https://placehold.co/600x400'></CardComponent>
              </Grid>
            ))}
          </Grid>
        </Container>
      );
    }

    return null;
  };

  return renderContent();
};

export default CompaniesPage;