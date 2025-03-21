import { Box, Typography, Grid } from "@mui/material";
import { CustomerData } from "@/types/DataType";
import AgeDistributionChart from "@/components/charts/AgeDistributionChart";
import TotalOrdersVsAverageSpendChart from "@/components/charts/LastPurchesDate";
import CustomersByRegionChart from "@/components/charts/CustomersByRegionChart";
import MonthlySignupsChart from "@/components/charts/MonthlySignupsChart";
import { useMemo } from "react";
import LastPurchesDateChart from "@/components/charts/LastPurchesDate";
import CustomerList from "@/components/CustomerList";

export default function CustomerProfile({
  data,
  onDelete,
}: {
  data: CustomerData[];
  onDelete: () => void;
}) {
  const getAgeDistribution = (data: CustomerData[]) => {
    const ageRanges = [
      { range: "0-18", count: 0 },
      { range: "19-35", count: 0 },
      { range: "36-50", count: 0 },
      { range: "51+", count: 0 },
    ];

    data.forEach((customer) => {
      const age = customer.age;
      if (age <= 18) {
        ageRanges[0].count++;
      } else if (age <= 35) {
        ageRanges[1].count++;
      } else if (age <= 50) {
        ageRanges[2].count++;
      } else {
        ageRanges[3].count++;
      }
    });

    return ageRanges;
  };
  const ageData = useMemo(() => getAgeDistribution(data), [data]);

  const totalOrdersVsSpendData = data.map((customer) => ({
    totalOrders: customer.total_orders,
    averageSpend: customer.average_spend,
  }));

  const getRegionData = (data: CustomerData[]) => {
    const regionCounts: { [key: string]: number } = {};

    data.forEach((customer) => {
      const region = customer.region;
      if (regionCounts[region]) {
        regionCounts[region]++;
      } else {
        regionCounts[region] = 1;
      }
    });

    return Object.entries(regionCounts).map(([region, count]) => ({
      region,
      count,
    }));
  };

  const regionData = useMemo(() => getRegionData(data), [data]);

  const getSignupsData = (data: CustomerData[]) => {
    const signupsByMonth: { [key: string]: number } = {};

    data.forEach((customer) => {
      const signupDate = new Date(customer.signup_date);
      const month = signupDate.toISOString().slice(0, 7); // YYYY-MM
      signupsByMonth[month] = (signupsByMonth[month] || 0) + 1;
    });

    const sortedSignups = Object.entries(signupsByMonth)
      .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
      .map(([month, count]) => ({
        month,
        count,
      }));

    return {
      signupsByMonth: sortedSignups,
    };
  };

  const { signupsByMonth } = useMemo(() => getSignupsData(data), [data]);

  return (
    <>
      <Box>
        <Typography variant="h4">Customer Profile</Typography>
      </Box>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <AgeDistributionChart ageData={ageData} />
        </Grid>
        <Grid item xs={12} md={6}>
          <CustomersByRegionChart regionData={regionData} />
        </Grid>
        <Grid item xs={12} md={12}>
          <LastPurchesDateChart data={data} />
        </Grid>
        <Grid item xs={12}>
          <MonthlySignupsChart signupsDataByMonth={signupsByMonth} />
        </Grid>
        <Grid item xs={12}>
          <CustomerList tableData={data} onDelete={onDelete} />
        </Grid>
      </Grid>
    </>
  );
}
