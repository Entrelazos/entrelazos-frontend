import { FC } from "react"
import SimpleDataCard from "../../components/SimpleDataCard"
import { Container } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { Home } from "@mui/icons-material";
import ChartDataCard from "../../components/ChartCard";

const Dashboard: FC = () => (
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
                <ChartDataCard />
            </Grid2>
        </Grid2>
    </Container>
)
export default Dashboard;