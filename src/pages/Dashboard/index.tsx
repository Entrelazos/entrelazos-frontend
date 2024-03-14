import { FC, useEffect } from "react"
import SimpleDataCard from "../../components/SimpleDataCard"
import { Box, Card, CardHeader, Container, useTheme } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { Home } from "@mui/icons-material";
import ChartDataCard from "../../components/ChartCard";
import { radialBarData, radialBarseries, splineAreaData, splineAreaSeries } from "../../mock/chartData";
import ReactApexChart from "react-apexcharts";
import { useDispatch, useSelector } from "react-redux";
import { fetchCompaniesData } from "../../store/companies/companiesThunks";
import { AppDispatch } from "../../store/store";
import { CompanyApiResponse } from "../../types/companies/CompaniesTypes";
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';

const columns: GridColDef[] = [
  { field: 'name', headerName: 'Nombre', width: 70, flex: 1 },
  { field: 'description', headerName: 'Descripcion', flex: 1 },
  { field: 'type', headerName: 'Tipo', flex: 1 },
];

interface RootState {
  companies: {
    data: CompanyApiResponse | null;
    loading: boolean;
    error: string | null;
  };
}

const Dashboard: FC = () => {
  const theme = useTheme();
  const radialBarOptions = radialBarData(theme);
  const splineAreaOptions = splineAreaData(theme);
  const dispatch = useDispatch<AppDispatch>();
  const { data, loading, error } = useSelector(
    (state: RootState) => state.companies
  );

  useEffect(() => {
    dispatch(fetchCompaniesData());
  }, [dispatch]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  let rows = [];
  if (data) {
    rows = data.items.map((company, index) => ({
      id: index + 1,
      name: company.name,
      description: company.description,
      type: company.type
    }));
  }

  return (
    <Container maxWidth="xl">
      <Grid2 container spacing={3}>
        <Grid2 xs={12} md={4} >
          <SimpleDataCard title="Total Active Users" mainText="18,000" subtitle="10%" Icon={Home} />
        </Grid2>
        <Grid2 xs={12} md={4}>
          <SimpleDataCard title="Total Installed" mainText="1,000" subtitle="10%" Icon={Home} />
        </Grid2>
        <Grid2 xs={12} md={4}>
          <SimpleDataCard title="Total Downloads" mainText="182,000" subtitle="10%" Icon={Home} />
        </Grid2>
        <Grid2 xs={12} md={6} lg={4}>
          <ChartDataCard title="Sales" subtitle="Chart description" chartOptions={radialBarOptions} chartSeries={radialBarseries} />
        </Grid2>
        <Grid2 xs={12} md={6} lg={8} >
          <Card raised sx={{ borderRadius: '12px' }}>
            <CardHeader title="Grafica de Area" subheader="Descripcion de la grafica" titleTypographyProps={{ fontSize: '1.125rem', fontWeight: "700" }} />
            <Box sx={{ margin: "24px 24px 0" }}>
              <ReactApexChart options={splineAreaOptions} series={splineAreaSeries} type="area" height={364}></ReactApexChart>
            </Box>
          </Card>
        </Grid2>
        {
          data &&
          <Grid2 xs={12} md={6} lg={8} >
            <Card raised sx={{ borderRadius: '12px' }}>
              <CardHeader title="Empresas" titleTypographyProps={{ fontSize: '1.125rem', fontWeight: "700" }} />
              <Box sx={{ margin: "24px 24px 24px" }}>
                <DataGrid
                  rows={rows}
                  columns={columns}
                  initialState={{
                    pagination: {
                      paginationModel: { page: data.meta.currentPage, pageSize: data.meta.itemsPerPage },
                    },
                  }}
                  pageSizeOptions={[5, 10]}
                  checkboxSelection
                />
              </Box>
            </Card>
          </Grid2>
        }
      </Grid2>
    </Container>
  )
}
export default Dashboard;