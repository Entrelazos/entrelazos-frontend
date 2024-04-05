import { FC, SetStateAction, useEffect, useState } from 'react';
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
import { fetchCompaniesData } from '../../store/companies/companiesThunks';
import { AppDispatch, RootState } from '../../store/store';
import { CompanyItem } from '../../types/companies/CompaniesTypes';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import ReactCountryFlag from 'react-country-flag';
import { Link } from 'react-router-dom';

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
  const theme = useTheme();
  const radialBarOptions = radialBarData(theme);
  const splineAreaOptions = splineAreaData(theme);

  const dispatch = useDispatch<AppDispatch>();
  const { data, loading, error } = useSelector(
    (state: RootState) => state.companies
  );

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 5,
  });

  const { items, meta } = data || {
    items: [],
    meta: { currentPage: 1, itemsPerPage: 10 },
  };

  const rows = items.map((company: CompanyItem, index: number) => ({
    id: company.id,
    name: company.name,
    description: company.description,
    type: company.type,
    country: company?.address[0]?.city?.region?.country?.alpha_code || '',
  }));

  const [rowCountState, setRowCountState] = useState(meta?.totalItems || 0);
  useEffect(() => {
    setRowCountState((prevRowCountState) =>
      meta?.totalItems !== undefined ? meta?.totalItems - 1 : prevRowCountState
    );
  }, [meta?.totalItems, setRowCountState]);

  useEffect(() => {
    dispatch(
      fetchCompaniesData({
        page: paginationModel.page === 0 ? 1 : paginationModel.page + 1,
        limit: paginationModel.pageSize,
      })
    );
  }, [paginationModel]);

  const handlePaginationModelChange = (newPaginationModel: {
    page: number;
    pageSize: number;
  }) => {
    setPaginationModel(newPaginationModel);
  };

  return (
    <Box>
      <Box display='flex' justifyContent='right' marginBottom={4}>
        <Button
          variant='contained'
          startIcon={<Add />}
          component={Link}
          to='/empresas/agregar'
        >
          Añadir una empresa
        </Button>
      </Box>
      <Grid2 container spacing={3}>
        <Grid2 xs={12} md={4}>
          <SimpleDataCard
            title='Numero de Empresas Registradas'
            mainText={(meta.totalItems - 1)?.toString()}
          />
        </Grid2>
        <Grid2 xs={12} md={4}>
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
        </Grid2>
        <Grid2 xs={12} md={6} lg={4}>
          <ChartDataCard
            title='Sales'
            subtitle='Chart description'
            chartOptions={radialBarOptions}
            chartSeries={radialBarseries}
          />
        </Grid2>
        <Grid2 xs={12} md={6} lg={8}>
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
        </Grid2>
        <Grid2 xs={12} md={6} lg={8}>
          <Card raised sx={{ borderRadius: '12px' }}>
            <CardHeader
              title='Empresas'
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
