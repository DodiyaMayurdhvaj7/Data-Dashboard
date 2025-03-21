/* import React from "react";
import Chart from "react-apexcharts";

interface CustomersByRegionChartProps {
  regionData: { region: string; count: number }[];
}

const CustomersByRegionChart: React.FC<CustomersByRegionChartProps> = ({
  regionData,
}) => {
  const series = regionData.map((item) => item.count);
  const labels = regionData.map((item) => item.region);

  const options = {
    chart: {
      type: "pie",
    },
    title: {
      text: "Customers by Region",
    },
  };

  return <Chart options={{ labels }} series={series} type="pie" height={350} />;
};

export default CustomersByRegionChart;
 */
"use client";

// Next Imports
import dynamic from "next/dynamic";

// MUI Imports
import Card from "@mui/material/Card";
import { useTheme } from "@mui/material/styles";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";

// Third-party Imports
import type { ApexOptions } from "apexcharts";

// Styled Component Imports
const AppReactApexCharts = dynamic(
  () => import("@/libs/styles/AppReactApexCharts")
);

const donutColors = {
  series1: "#fdd835",
  series2: "#00d4bd",
  series3: "#826bf8",
  series4: "#32baff",
  series5: "#ffa1a1",
};
interface CustomersByRegionChartProps {
  regionData: { region: string; count: number }[];
}
const CustomersByRegionChart: React.FC<CustomersByRegionChartProps> = ({
  regionData,
}) => {
  const theme = useTheme();
  const textSecondary = "var(--mui-palette-text-secondary)";

  const options: ApexOptions = {
    stroke: { width: 0 },
    labels: regionData.map((item) => item.region),
    colors: [
      theme.palette.mode === "dark" ? donutColors.series1 : "#fdd835",
      theme.palette.mode === "dark" ? donutColors.series5 : "#ffa1a1",
      theme.palette.mode === "dark" ? donutColors.series3 : "#826bf8",
      theme.palette.mode === "dark" ? donutColors.series2 : "#00d4bd",
    ],
    dataLabels: {
      enabled: true,
      formatter: (val: string) => `${parseInt(val, 10)}%`,
    },
    legend: {
      fontSize: "13px",
      position: "bottom",
      markers: {
        offsetX: theme.direction === "rtl" ? 7 : -4,
      },
      labels: { colors: textSecondary },
      itemMargin: {
        horizontal: 9,
      },
    },
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: true,
            name: {
              fontSize: "1.2rem",
            },
            value: {
              fontSize: "1.2rem",
              color: textSecondary,
              formatter: (val: string) => `${parseInt(val, 10)}`,
            },
            total: {
              show: true,
              fontSize: "1.2rem",
              label: "Operational",
              formatter: () => "31%",
              color: "var(--mui-palette-text-primary)",
            },
          },
        },
      },
    },
    responsive: [
      {
        breakpoint: 992,
        options: {
          chart: {
            height: 380,
          },
          legend: {
            position: "bottom",
          },
        },
      },
      {
        breakpoint: 576,
        options: {
          chart: {
            height: 320,
          },
          plotOptions: {
            pie: {
              donut: {
                labels: {
                  show: true,
                  name: {
                    fontSize: "1rem",
                  },
                  value: {
                    fontSize: "1rem",
                  },
                  total: {
                    fontSize: "1rem",
                  },
                },
              },
            },
          },
        },
      },
    ],
  };

  return (
    <Card>
      <CardHeader
        title="Customers by Region" /* subheader="Customers by Region" */
      />
      <CardContent>
        <AppReactApexCharts
          type="donut"
          width="100%"
          height={400}
          options={options}
          series={regionData.map((item) => item.count)}
        />
      </CardContent>
    </Card>
  );
};

export default CustomersByRegionChart;
