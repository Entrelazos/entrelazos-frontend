import { FC, useEffect, useState } from 'react';
import SimpleDataCard from '../../components/SimpleDataCard';
import { Box, Button, Card, CardHeader, useTheme } from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import { Home, Add } from '@mui/icons-material';
import ChartDataCard from '../../components/ChartCard';
import {
  radialBarData,
  radialBarseries,
  splineAreaData,
  splineAreaSeries,
} from '../../mock/chartData';
import ReactApexChart from 'react-apexcharts';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchCompaniesData,
  fetchUserCompanies,
} from '../../store/companies/companiesThunks';
import { AppDispatch, RootState } from '../../store/store';
import { CompanyItem } from '../../types/companies/CompaniesTypes';
import {
  DataGrid,
  GridCallbackDetails,
  GridColDef,
  GridRowParams,
  MuiEvent,
} from '@mui/x-data-grid';
import ReactCountryFlag from 'react-country-flag';
import { Link, useNavigate } from 'react-router-dom';

const columns: GridColDef[] = [
  { field: 'name', headerName: 'Nombre', width: 70, flex: 1 },
  { field: 'description', headerName: 'Descripcion', flex: 1 },
  {
    field: 'country',
    headerName: 'Pais',
    flex: 1,
    renderCell(params) {
      return (
        <ReactCountryFlag
          countryCode={params.row.country}
          style={{
            fontSize: '1.5rem',
            lineHeight: '2em',
          }}
        ></ReactCountryFlag>
      );
    },
  },
  { field: 'type', headerName: 'Tipo', flex: 1 },
];

const Dashboard: FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { userCompaniesData, loading, error } = useSelector(
    (state: RootState) => state.companies
  );
  const { uid } = useSelector((state: RootState) => state.auth);

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 5,
  });

  const { items, meta } = userCompaniesData || {
    items: [],
    meta: { currentPage: 1, itemsPerPage: 10 },
  };

  const rows = items.map((company: CompanyItem, index: number) => ({
    id: company.id,
    name: company.name,
    description: company.description,
    type: company?.categories[0]?.category_name || 'Otro',
    country: company?.addresses[0]?.city?.region?.country?.alpha_code || '',
  }));

  const [rowCountState, setRowCountState] = useState(meta?.totalItems || 0);
  useEffect(() => {
    setRowCountState((prevRowCountState) =>
      meta?.totalItems !== undefined ? meta?.totalItems : prevRowCountState
    );
  }, [meta?.totalItems, setRowCountState]);

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
  }, [paginationModel]);

  const handlePaginationModelChange = (newPaginationModel: {
    page: number;
    pageSize: number;
  }) => {
    setPaginationModel(newPaginationModel);
  };

  function handleRowClick(params: GridRowParams<any>): void {
    const { name } = params.row;
    navigate(`/empresas/perfil-compania/${name}`);
  }

  return (
    <Box>
      <Box display='flex' justifyContent='right' marginBottom={4}>
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
            title='Numero de Empresas Registradas'
            mainText={meta.totalItems?.toString()}
          />
        </Grid2>
        {/* <Grid2 xs={12} md={4}>
          <SimpleDataCard
            title='Total Installed'
            mainText='1,000'
            subtitle='10%'
            Icon={Home}
          />
        </Grid2>
        <Grid2 xs={12} md={4}>
          <SimpleDataCard
            title='Total Downloads'
            mainText='182,000'
            subtitle='10%'
            Icon={Home}
          />
        </Grid2> */}
        {/* <Grid2 xs={12} md={6} lg={4}>
          <ChartDataCard
            title='Sales'
            subtitle='Chart description'
            chartOptions={radialBarOptions}
            chartSeries={radialBarseries}
          />
        </Grid2> */}
        {/* <Grid2 xs={12} md={6} lg={8}>
          <Card raised sx={{ borderRadius: '12px' }}>
            <CardHeader
              title='Grafica de Area'
              subheader='Descripcion de la grafica'
              titleTypographyProps={{ fontSize: '1.125rem', fontWeight: '700' }}
            />
            <Box sx={{ margin: '24px 24px 0' }}>
              <ReactApexChart
                options={splineAreaOptions}
                series={splineAreaSeries}
                type='area'
                height={364}
              ></ReactApexChart>
            </Box>
          </Card>
        </Grid2> */}
        <Grid2 xs={12} md={6} lg={8}>
          <Card raised sx={{ borderRadius: '12px' }}>
            <CardHeader
              title='Mis Empresas'
              titleTypographyProps={{
                fontSize: '1.125rem',
                fontWeight: '700',
              }}
            />
            <Box sx={{ margin: '24px 24px 24px' }}>
              <DataGrid
                rows={rows}
                columns={columns}
                rowCount={rowCountState}
                loading={loading}
                paginationMode='server'
                onPaginationModelChange={handlePaginationModelChange}
                paginationModel={paginationModel}
                pageSizeOptions={[5, 10]}
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
