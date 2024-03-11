import { FC } from "react"
import SimpleDataCard from "../../components/SimpleDataCard"
import { Box, Card, CardHeader, Container, useTheme } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { Home } from "@mui/icons-material";
import ChartDataCard from "../../components/ChartCard";
import { radialBarData, radialBarseries, splineAreaData, splineAreaSeries } from "../../mock/chartData";
import ReactApexChart from "react-apexcharts";

const Dashboard: FC = () => {
    const theme = useTheme();
    const radialBarOptions = radialBarData(theme);
    const splineAreaOptions = splineAreaData(theme);

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
            </Grid2>
        </Container>
    )
}
export default Dashboard;