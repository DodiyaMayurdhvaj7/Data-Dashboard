import AppReactApexCharts from "@/libs/styles/AppReactApexCharts";
import CardHeader from "@mui/material/CardHeader";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import React from "react";
import { CustomerData } from "@/types/DataType";
import { useTheme } from "@mui/material/styles";

interface LastPurchesDateChartProps {
  data: CustomerData[];
}

const LastPurchesDateChart: React.FC<LastPurchesDateChartProps> = ({
  data,
}) => {
  const transformedData = data.reduce(
    (acc, item) => {
      const date = new Date(item.last_purchase_date);
      const month = date.toLocaleString("default", { month: "long" });
      const region = item.region;

      if (!acc[region]) {
        acc[region] = {};
      }
      if (!acc[region][month]) {
        acc[region][month] = 0;
      }
      acc[region][month] += 1;
      return acc;
    },
    {} as { [region: string]: { [month: string]: number } }
  );

  const allMonths = Array.from(
    new Set(
      data.map((item) =>
        new Date(item.last_purchase_date).toLocaleString("default", {
          month: "long",
        })
      )
    )
  );

  const series = Object.entries(transformedData).map(([region, monthData]) => ({
    name: region,
    data: allMonths.map((month) => ({ x: month, y: monthData[month] || 0 })),
  }));

  const theme = useTheme();

  const options = {
    chart: {
      type: "heatmap" as const,
      toolbar: {
        show: true,
        tools: { download: true },
      },
    },
    dataLabels: {
      enabled: true,
      formatter: function (val: number) {
        return val.toString();
      },
    },
    colors: [
      theme.palette.mode === "dark" ? "#008FFB" : "#00A3E0",
      theme.palette.mode === "dark" ? "#00E396" : "#00B74D",
      theme.palette.mode === "dark" ? "#FEB019" : "#F6A600",
      theme.palette.mode === "dark" ? "#FF4560" : "#FF4C4C",
      theme.palette.mode === "dark" ? "#775DD0" : "#6F5B9A",
    ],
    tooltip: {
      enabled: true,
      shared: true,
      intersect: false,
      y: {
        formatter: function (val: number) {
          return val + " purchases";
        },
      },
    },
    grid: {
      padding: { top: -20 },
    },
    yaxis: {
      labels: {
        style: {
          colors: "var(--mui-palette-text-disabled)",
          fontSize: "13px",
        },
      },
    },
    xaxis: {
      labels: {
        style: {
          colors: "var(--mui-palette-text-disabled)",
          fontSize: "13px",
        },
      },
      axisTicks: { show: false },
      axisBorder: { show: false },
    },
  };

  return (
    <Card>
      <CardHeader
        title="Time-Based Activity Heatmap"
        subheader="Visualizing purchase frequency per month by region"
      />
      <CardContent>
        <AppReactApexCharts
          type="heatmap"
          width="100%"
          height={400}
          options={options}
          series={series}
        />
      </CardContent>
    </Card>
  );
};

export default LastPurchesDateChart;
