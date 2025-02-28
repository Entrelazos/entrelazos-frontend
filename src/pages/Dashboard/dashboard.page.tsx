import { FC, useEffect, useMemo, useState } from 'react';
import { Box, Button, Card, CardHeader } from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import { Add } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserCompanies } from '../../store/companies/companiesThunks';
import { AppDispatch, RootState } from '../../store/store';
import { CompanyItem } from '../../types/companies/CompaniesTypes';
import { DataGrid, GridColDef, GridRowParams } from '@mui/x-data-grid';
import ReactCountryFlag from 'react-country-flag';
import { Link, useNavigate } from 'react-router-dom';
import SimpleDataCard from '../../components/SimpleDataCard';

const columns: GridColDef[] = [
  { field: 'name', headerName: 'Nombre', flex: 1 },
  { field: 'description', headerName: 'Descripcion', flex: 1 },
  {
    field: 'country',
    headerName: 'Pais',
    flex: 1,
    renderCell: (params) => (
      <ReactCountryFlag
        countryCode={params.row.country}
        style={{ fontSize: '1.5rem', lineHeight: '2em' }}
      />
    ),
  },
  { field: 'type', headerName: 'Tipo', flex: 1 },
];

const Dashboard: FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { userCompaniesData, loading } = useSelector(
    (state: RootState) => state.companies
  );
  const { uid } = useSelector((state: RootState) => state.auth);

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 5,
  });

  const { items = [], meta = { totalItems: 0 } } = userCompaniesData || {};

  const rows = useMemo(
    () =>
      items.map((company: CompanyItem) => ({
        id: company.id,
        name: company.name,
        description: company.description,
        type: company.categories?.[0]?.category_name || 'Otro',
        country:
          company.addresses?.[0]?.city?.region?.country?.alpha_code || '',
      })),
    [items]
  );

  useEffect(() => {
    dispatch(
      fetchUserCompanies({
        userId: parseInt(uid),
        options: {
          page: paginationModel.page + 1,
          limit: paginationModel.pageSize,
        },
      })
    );
  }, [paginationModel, dispatch, uid]);

  const handleRowClick = (params: GridRowParams) => {
    navigate(`/empresas/perfil-compania/${params.row.name}`);
  };

  return (
    <Box>
      <Box display='flex' justifyContent='flex-end' mb={4}>
        <Button
          variant='contained'
          startIcon={<Add />}
          component={Link}
          to='/inscribir-empresas'
        >
          Inscribir una empresa
        </Button>
      </Box>

      <Grid2 container spacing={3}>
        <Grid2 xs={12} md={4}>
          <SimpleDataCard
            title='Número de Empresas Registradas'
            mainText={meta.totalItems.toString()}
          />
        </Grid2>

        <Grid2 xs={12} md={6} lg={8}>
          <Card raised sx={{ borderRadius: 2 }}>
            <CardHeader
              title='Mis Empresas'
              titleTypographyProps={{ fontSize: '1.125rem', fontWeight: 700 }}
            />
            <Box sx={{ margin: 3 }}>
              <DataGrid
                rows={rows}
                columns={columns}
                rowCount={meta.totalItems}
                loading={loading}
                paginationMode='server'
                paginationModel={paginationModel}
                pageSizeOptions={[5, 10]}
                onPaginationModelChange={setPaginationModel}
                onRowClick={handleRowClick}
                sx={{
                  '& .MuiDataGrid-columnHeaders': {
                    backgroundColor: 'black',
                    opacity: 0.5,
                  },
                }}
              />
            </Box>
          </Card>
        </Grid2>
      </Grid2>
    </Box>
  );
};

export default Dashboard;
