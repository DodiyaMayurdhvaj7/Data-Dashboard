"use client";

// Next Imports
import dynamic from "next/dynamic";
import { useState } from "react";

import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";

import type { ApexOptions } from "apexcharts";

const AppReactApexCharts = dynamic(
  () => import("@/libs/styles/AppReactApexCharts")
);

// Define the props interface
interface MonthlySignupsChartProps {
  signupsDataByMonth: { month: string; count: number }[];
}

const MonthlySignupsChart = ({
  signupsDataByMonth,
}: MonthlySignupsChartProps) => {
  const series = [
    {
      data: signupsDataByMonth.map((data) => data.count),
    },
  ];

  // Vars
  const divider = "var(--mui-palette-divider)";
  const disabledText = "var(--mui-palette-text-disabled)";

  const options: ApexOptions = {
    chart: {
      parentHeightOffset: 0,
      zoom: { enabled: false },
      toolbar: { show: false },
    },
    colors: ["#ff9f43"],
    stroke: { curve: "straight" },
    dataLabels: { enabled: false },
    markers: {
      strokeWidth: 7,
      strokeOpacity: 1,
      colors: ["#ff9f43"],
      strokeColors: ["#fff"],
    },
    grid: {
      padding: { top: -10 },
      borderColor: divider,
      xaxis: {
        lines: { show: true },
      },
    },
    tooltip: {
      custom(data: any) {
        return `<div class='bar-chart'>
          <span>${data.series[data.seriesIndex][data.dataPointIndex]} counts</span>
        </div>`;
      },
    },
    yaxis: {
      labels: {
        style: { colors: disabledText, fontSize: "13px" },
      },
    },
    xaxis: {
      axisBorder: { show: false },
      axisTicks: { color: divider },
      crosshairs: {
        stroke: { color: divider },
      },
      labels: {
        style: { colors: disabledText, fontSize: "13px" },
      },
      categories: signupsDataByMonth.map((data) =>
        new Date(data.month).toLocaleString("default", {
          month: "short",
          year: "numeric",
        })
      ),
    },
  };

  return (
    <Card>
      <CardHeader
        title="Monthly Signups"
        subheader="Signups per month"
        sx={{
          flexDirection: ["column", "row"],
          alignItems: ["flex-start", "center"],
          "& .MuiCardHeader-action": { mb: 0 },
          "& .MuiCardHeader-content": { mb: [2, 0] },
        }}
      />
      <CardContent>
        <AppReactApexCharts
          type="line"
          width="100%"
          height={400}
          options={options}
          series={series}
        />
      </CardContent>
    </Card>
  );
};

export default MonthlySignupsChart;
