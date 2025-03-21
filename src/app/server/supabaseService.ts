import { supabase } from "@/app/superbaseClient";
import { CustomerData } from "@/types/DataType";

export async function fetchCustomers(
  filters: any = {}
): Promise<CustomerData[]> {
  let query = supabase.from("Customer").select("*");
  if (filters.region && filters.region !== "all") {
    query = query.eq("region", filters.region);
  }
  if (filters.city && filters.city !== "all") {
    query = query.eq("city", filters.city);
  }
  if (filters.minAge && filters.maxAge) {
    query = query.gte("age", filters.minAge).lte("age", filters.maxAge);
  }
  if (filters.gender && filters.gender !== "all") {
    query = query.eq("gender", filters.gender);
  }
  const { data, error } = await query;

  if (error) {
    console.error("Error fetching customers:", error);
    throw error;
  }

  console.log("Fetched customer data:", data);
  return data as CustomerData[];
}

export async function fetchUniqueValues(column: string): Promise<string[]> {
  const { data, error } = await supabase.from("Customer").select(column);

  if (error) {
    console.error("Error fetching unique values:", error);
    throw new Error(error.message);
  }
  const uniqueValues = Array.from(
    new Set(data.map((item: any) => item[column]))
  );
  return uniqueValues;
}

export async function fetchFilterOptions(): Promise<{
  regions: string[];
  cities: string[];
  ages: string[];
  genders: string[];
}> {
  const regions = await fetchUniqueValues("region");
  const cities = await fetchUniqueValues("city");
  const ages = await fetchUniqueValues("age");
  const genders = await fetchUniqueValues("gender");

  return { regions, cities, ages, genders };
}
