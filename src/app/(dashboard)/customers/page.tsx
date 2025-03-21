"use client";
import React, { useEffect, useState } from "react";
import {
  fetchCustomers,
  fetchFilterOptions,
} from "@/app/server/supabaseService";
import { CircularProgress, Box, Grid } from "@mui/material";
import CustomerProfile from "@/views/CustomerDashboard/customerProfile";
import {
  Person,
  Group,
  MonetizationOn,
  ThumbUp,
  Web,
  LocationOn,
  AccessTime,
  People,
} from "@mui/icons-material";
import ShoppingCart from "@mui/icons-material/ShoppingCart";
import CustomAutocomplete from "@/components/CustomAutocomplete";
import CustomPaper from "@/components/CustomPaper";
import { CustomerData } from "@/types/DataType";

function Dashboard() {
  const [loading, setLoading] = useState<boolean>(true);
  const [customerData, setCustomerData] = useState<CustomerData[]>([]);
  const [regionFilter, setRegionFilter] = useState<string>("all");
  const [cityFilter, setCityFilter] = useState<string>("all");
  const [ageFilter, setAgeFilter] = useState<string>("all");
  const [genderFilter, setGenderFilter] = useState<string>("all");
  const [regions, setRegions] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);

  const fetchData = async () => {
    try {
      const { regions, cities } = await fetchFilterOptions();
      setRegions(regions);
      setCities(cities);
      await fetchCustomersfunc();
    } catch (error) {
      console.error("Error fetching filter options:", error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  const handleDelete = () => {
    fetchCustomersfunc();
  };

  useEffect(() => {
    fetchCustomersfunc();
  }, [regionFilter, cityFilter, ageFilter, genderFilter]);

  async function fetchCustomersfunc() {
    try {
      const filters: any = {};
      if (regionFilter !== "all") filters.region = regionFilter;
      if (cityFilter !== "all") filters.city = cityFilter;

      if (ageFilter !== "all") {
        const [minAge, maxAge] = ageFilter.split("-").map(Number);
        filters.minAge = minAge;
        filters.maxAge = maxAge;
      }
      if (genderFilter !== "all") filters.gender = genderFilter;

      const customersData: CustomerData[] = await fetchCustomers(filters);
      setCustomerData(customersData);
    } catch (error: any) {
      console.error("Error fetching data:", error.message);
    } finally {
      setLoading(false);
    }
  }

  if (loading)
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );

  return (
    <Grid container>
      <Grid container spacing={2} sx={{ marginBottom: "2rem" }}>
        <Grid item xs={12} sm={6} md={3} sx={{ padding: "1rem" }}>
          <CustomAutocomplete
            value={regionFilter}
            onChange={(event, newValue) => setRegionFilter(newValue || "all")}
            options={["all", ...regions]}
            label="Region"
            icon={<Person sx={{ mr: 1 }} />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3} sx={{ padding: "1rem" }}>
          <CustomAutocomplete
            value={cityFilter}
            onChange={(event, newValue) => setCityFilter(newValue || "all")}
            options={["all", ...cities]}
            label="City"
            icon={<LocationOn sx={{ mr: 1 }} />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3} sx={{ padding: "1rem" }}>
          <CustomAutocomplete
            value={ageFilter}
            onChange={(event, newValue) => setAgeFilter(newValue || "all")}
            options={["all", "18-30", "31-45", "46-60", "60+"]}
            label="Age Group"
            icon={<AccessTime sx={{ mr: 1 }} />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3} sx={{ padding: "1rem" }}>
          <CustomAutocomplete
            value={genderFilter}
            onChange={(event, newValue) => setGenderFilter(newValue || "all")}
            options={["all", "Male", "Female", "Other"]}
            label="Gender"
            icon={<People sx={{ mr: 1 }} />}
          />
        </Grid>
      </Grid>
      <Grid container spacing={2} sx={{ marginBottom: "2rem" }}>
        <Grid item xs={12} sm={6} md={4}>
          <CustomPaper
            icon={
              <Person
                sx={{ fontSize: 50, color: "#1976d2", marginBottom: "0.5rem" }}
              />
            }
            title="Total Customers"
            value={customerData.length}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <CustomPaper
            icon={
              <MonetizationOn
                sx={{ fontSize: 50, color: "#1976d2", marginBottom: "0.5rem" }}
              />
            }
            title="Avg. Spending"
            value={
              customerData.length > 0
                ? (
                    customerData.reduce(
                      (sum, item) => sum + item.average_spend,
                      0
                    ) / customerData.length
                  ).toFixed(2)
                : 0
            }
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <CustomPaper
            icon={
              <ShoppingCart
                sx={{ fontSize: 50, color: "#1976d2", marginBottom: "0.5rem" }}
              />
            }
            title="Total Orders"
            value={
              customerData.length > 0
                ? customerData
                    .reduce((sum, item) => sum + (item.total_orders || 0), 0)
                    .toFixed(0)
                : 0
            }
          />
        </Grid>
      </Grid>
      <Box sx={{ marginBottom: "2rem" }}>
        <CustomerProfile
          data={customerData as CustomerData[]}
          onDelete={handleDelete}
        />
      </Box>
    </Grid>
  );
}

export default Dashboard;
