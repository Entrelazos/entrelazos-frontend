import { Theme } from '@mui/material';
import { ApexOptions } from 'apexcharts';

const sales = [1200, 1500];
const salesMales = sales[0];
const salesFemales = sales[1];
const totalSales = sales.reduce((acc, value) => acc + value, 0);
const porcentageMales = Math.round((salesMales / totalSales) * 100);
const porcentageFemales = Math.round((salesFemales / totalSales) * 100);
export const radialBarseries = [porcentageMales, porcentageFemales];

export const radialBarData = (theme: Theme): ApexOptions => ({
  chart: {
    width: 380,
    type: 'radialBar',
  },
  plotOptions: {
    radialBar: {
      dataLabels: {
        show: true,
        name: {
          fontSize: '22px',
        },
        value: {
          show: true,
          fontSize: '1.5rem',
          fontFamily: undefined,
          fontWeight: 400,
          color: theme.palette.mode === 'dark' ? '#fff' : '#000',
          offsetY: 16,
        },
        total: {
          show: true,
          label: 'Total',
          color: theme.palette.mode === 'dark' ? '#919EAB' : '#000',
          fontSize: '0.875rem',
          fontFamily: undefined,
          fontWeight: 600,
          formatter: function () {
            return totalSales.toString();
          },
        },
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
        strokeWidth: '97%', // Set the stroke width here
        opacity: 0.2,
        margin: 5,
      },
    },
  },
  stroke: {
    lineCap: 'round',
  },
  labels: ['Hombres', 'Mujeres'],
  legend: {
    show: true,
    position: 'bottom',
    fontSize: '13px',
    itemMargin: { horizontal: 10 },
    markers: {
      offsetX: -4,
    },
    labels: {
      colors: theme.palette.mode === 'dark' ? '#fff' : '#000',
    },
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
});

export const splineAreaSeries = [
  {
    name: 'series1',
    data: [31, 40, 28, 51, 42, 20, 40, 43, 23, 56, 78, 89],
  },
  {
    name: 'series2',
    data: [11, 32, 45, 32, 34, 52, 45, 76, 34, 56, 87, 67],
  },
];

export const splineAreaData = (theme: Theme): ApexOptions => ({
  chart: {
    height: 350,
    type: 'area',
    toolbar: {
      show: false,
    },
    zoom: {
      enabled: false,
    },
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    curve: 'smooth',
    width: 3,
  },
  xaxis: {
    type: 'category',
    categories: [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ],
    labels: {
      style: {
        colors: theme.palette.mode === 'dark' ? '#919EAB' : '#000',
      },
    },
  },
  yaxis: {
    stepSize: 20,
    labels: {
      style: {
        colors: theme.palette.mode === 'dark' ? '#919EAB' : '#000',
      },
    },
  },
  tooltip: {
    x: {
      format: 'dd/MM/yy HH:mm',
    },
    theme: 'dark',
  },
  legend: {
    show: true,
    position: 'top',
    floating: true,
    fontSize: '13px',
    itemMargin: { horizontal: 10 },
    markers: {
      offsetX: -4,
    },
    labels: {
      colors: theme.palette.mode === 'dark' ? '#fff' : '#000',
    },
    horizontalAlign: 'right',
  },
  grid: {
    show: true,
    borderColor: 'rgba(128, 128, 128, 0.3)',
    strokeDashArray: 3,
    position: 'back',
    padding: {
      top: 20,
    },
  },
  fill: {
    type: 'gradient',
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.5,
      opacityTo: 0.1,
      stops: [0, 90, 100],
      inverseColors: true,
    },
  },
});
