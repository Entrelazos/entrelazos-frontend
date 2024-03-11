import React from 'react';
import { Card, CardContent, CardHeader } from '@mui/material';
import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';

interface ChartCardProperties {
  title?: string;
  subtitle?: string;
  chartOptions: ApexOptions;
  chartSeries: Array<number>;
}

const ChartDataCard: React.FC<ChartCardProperties> = ({ title, subtitle, chartOptions, chartSeries }) => (
  <Card raised sx={{ borderRadius: '12px' }}>
    <CardHeader title={title} subheader={subtitle} titleTypographyProps={{ fontSize: '1.125rem', fontWeight: "700" }} />
    <CardContent>
      <ReactApexChart options={chartOptions} series={chartSeries} type="radialBar" />
    </CardContent>
  </Card>
);

export default ChartDataCard;
