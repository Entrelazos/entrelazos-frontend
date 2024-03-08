import React from 'react';
import { Card, CardContent, CardHeader } from '@mui/material';
import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';

interface ChartCardProperties {
  title?: string;
  mainText?: string;
  subtitle?: string;
}

const sales = [1200, 1500];
const salesMales = sales[0];
const salesFemales = sales[1];
const totalSales = sales.reduce((acc, value) => acc + value, 0);
const porcentageMales = Math.round((salesMales / totalSales) * 100);
const porcentageFemales = Math.round((salesFemales / totalSales) * 100);
const series = [porcentageMales, porcentageFemales];

const options: ApexOptions = {
  chart: {
    width: 380,
    type: 'radialBar',
  },
  plotOptions: {
    radialBar: {
      dataLabels: {
        name: {
          fontSize: '22px',
        },
        value: {
          show: true,
          fontSize: '1.5rem',
          fontFamily: undefined,
          fontWeight: 400,
          color: '#fff',
          offsetY: 16,
        },
        total: {
          show: true,
          label: 'Total',
          color: '#919EAB',
          fontSize: '0.875rem',
          fontFamily: undefined,
          fontWeight: 600,
          formatter: function () {
            return totalSales.toString();

          }
        }
      },
      // Adjust the stroke settings here
      hollow: {
        margin: 5,
        size: '70%',
        background: 'transparent',
        image: undefined,
      },
      track: {
        show: true,
        startAngle: undefined,
        endAngle: undefined,
        background: '#919EAB',
        strokeWidth: '97%', // Set the stroke width here
        opacity: 0.2,
        margin: 5,
      },
    },
  },
  stroke: {
    lineCap: "round"
  },
  labels: ['Hombres', 'Mujeres'],
  legend: {
    show: true,
    position: 'bottom',
    fontSize: '13px',
    itemMargin: { horizontal: 10 },
    markers: {
      offsetX: -4
    },
    labels: {
      colors: "#fff",
    }
  },
  fill: {
    type: 'gradient',
    gradient: {
      shade: 'dark',
      type: 'horizontal',
      shadeIntensity: 0.5,
      gradientToColors: undefined,
      inverseColors: true,
      opacityFrom: 1,
      opacityTo: 1,
      stops: [0, 50, 100],
      colorStops: [],
    },
  },
};

const ChartDataCard: React.FC<ChartCardProperties> = () => {
  return (
    <Card raised sx={{ borderRadius: '12px' }}>
      <CardHeader title="Sales By Gender" titleTypographyProps={{ fontSize: '1.125rem', fontWeight: "700" }} />
      <CardContent>
        <ReactApexChart options={options} series={series} type="radialBar" height={380} />
      </CardContent>
    </Card>
  );
};

export default ChartDataCard;
