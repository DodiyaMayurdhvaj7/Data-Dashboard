import React from "react";
import Chart from "react-apexcharts";
import { Box, CardContent, CardHeader, Card, IconButton } from "@mui/material";
import AppReactApexCharts from "@/libs/styles/AppReactApexCharts";

interface AgeDistributionChartProps {
  ageData: { range: string; count: number }[];
}

const AgeDistributionChart: React.FC<AgeDistributionChartProps> = ({
  ageData,
}) => {
  const options = {
    chart: {
      type: "bar" as "bar",
      toolbar: { show: false },
      zoom: { enabled: false },
    },
    colors: ["#0000FF"],
    dataLabels: { enabled: false },
    grid: {
      borderColor: "var(--mui-palette-divider)",

      xaxis: {
        lines: { show: true },
      },
    },
    tooltip: {
      shared: true,
      intersect: false,
      custom: ({
        series,
        dataPointIndex,
      }: {
        series: number[][];
        dataPointIndex: number;
      }) => {
        return `<div class='bar-chart' style="text-align: center;">
          <span style="font-size: 16px; font-weight: bold;">${series[0][dataPointIndex]}</span>
        </div>`;
      },
    },
    xaxis: {
      categories: ["0-18", "19-35", "36-50", "51+"],
      axisBorder: { show: true, color: "var(--mui-palette-divider)" },
      axisTicks: { show: true, color: "var(--mui-palette-divider)" },
      labels: {
        style: {
          colors: "var(--mui-palette-text-primary)",
          fontSize: "14px",
          fontWeight: 500,
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: "var(--mui-palette-text-primary)",
          fontSize: "14px",
          fontWeight: 500,
        },
      },
      title: {
        text: "Customers",
        style: {
          color: "var(--mui-palette-text-primary)",
          fontSize: "14px",
          fontWeight: 600,
        },
      },
    },
  };

  const series = [
    {
      name: "Age Group",
      data: ageData.map((item) => item.count),
    },
  ];

  {
    /* <Box className="chart-container">
    <Chart options={options} series={series} type="bar" height={350} />
  </Box> */
  }
  return (
    <Card>
      <CardHeader
        title="Age Distribution"
        /*   subheader="Commercial networks & enterprises" */
        sx={{
          flexDirection: ["column", "row"],
          alignItems: ["flex-start", "center"],
          "& .MuiCardHeader-action": { mb: 0 },
          "& .MuiCardHeader-content": { mb: [2, 0] },
        }}
      />
      <CardContent>
        <AppReactApexCharts
          type="bar"
          width="100%"
          height={400}
          options={options}
          series={series}
        />
      </CardContent>
    </Card>
  );
};

export default AgeDistributionChart;
