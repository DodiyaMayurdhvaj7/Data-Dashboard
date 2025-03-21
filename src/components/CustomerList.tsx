"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import { styled } from "@mui/material/styles";
import TablePagination from "@mui/material/TablePagination";
import type { TextFieldProps } from "@mui/material/TextField";

import classnames from "classnames";
import { rankItem } from "@tanstack/match-sorter-utils";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getFilteredRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFacetedMinMaxValues,
  getPaginationRowModel,
  getSortedRowModel,
} from "@tanstack/react-table";
import type { ColumnDef, FilterFn } from "@tanstack/react-table";
import type { RankingInfo } from "@tanstack/match-sorter-utils";

import type { ThemeColor } from "@core/types";
import type { CustomerData } from "@/types/DataType";

// Component Imports
/* import TableFilters from "./TableFilters";
import AddUserDrawer from "./AddUserDrawer"; */
import OptionMenu from "@core/components/option-menu";
import CustomAvatar from "@core/components/mui/Avatar";
import ConfirmationDialog from "@/components/ConfirmationDialog";

// Util Imports
import { getInitials } from "@/utils/getInitials";

// Style Imports
import tableStyles from "@core/styles/table.module.css";
import { supabase } from "@/app/superbaseClient";

declare module "@tanstack/table-core" {
  interface FilterFns {
    fuzzy: FilterFn<unknown>;
  }
  interface FilterMeta {
    itemRank: RankingInfo;
  }
}

type CustomerDataWithAction = CustomerData & {
  action?: string;
};

type CustomerRegionType = {
  [key: string]: { icon: string; color: string };
};

type CustomerGenderType = {
  [key: string]: ThemeColor;
};

// Styled Components
const Icon = styled("i")({});

const fuzzyFilter: FilterFn<CustomerData> = (row, columnId, value, addMeta) => {
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value);

  // Store the itemRank info
  addMeta({
    itemRank,
  });

  // Return if the item should be filtered in/out
  return itemRank.passed;
};

const DebouncedInput = ({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}: {
  value: string | number;
  onChange: (value: string | number) => void;
  debounce?: number;
} & Omit<TextFieldProps, "onChange">) => {
  // States
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounce);

    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <TextField
      {...props}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      size="small"
    />
  );
};

// Vars
const customerRegionObj: CustomerRegionType = {
  "East Asia and the Pacific": { icon: "ri-globe-line", color: "info" },
  "Europe and Central Asia": { icon: "ri-globe-line", color: "primary" },
  "Latin America and the Caribbean": {
    icon: "ri-globe-line",
    color: "warning",
  },
  "Middle East and North Africa": { icon: "ri-globe-line", color: "error" },
  "North America": { icon: "ri-globe-line", color: "success" },
  "South Asia": { icon: "ri-globe-line", color: "info" },
  "Sub-Saharan Africa": { icon: "ri-globe-line", color: "secondary" },
};

const customerGenderObj: CustomerGenderType = {
  Male: "success",
  Female: "warning",
};

// Column Definitions
const columnHelper = createColumnHelper<CustomerDataWithAction>();

const UserListTable = ({
  tableData,
  onDelete,
}: {
  tableData?: CustomerData[];
  onDelete: () => void;
}) => {
  // States
  const [addUserOpen, setAddUserOpen] = useState(false);
  const [rowSelection, setRowSelection] = useState({});
  const [data, setData] = useState(...[tableData]);
  const [filteredData, setFilteredData] = useState(data);
  const [globalFilter, setGlobalFilter] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState<CustomerData | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setData(tableData);
    setFilteredData(tableData);
  }, [tableData]);

  // Hooks
  const { lang: locale } = useParams();

  const columns = useMemo<ColumnDef<CustomerDataWithAction, any>[]>(
    () => [
      columnHelper.accessor("name", {
        header: "Customer",
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            {getAvatar({
              name: row.original.name,
              email: row.original.email,
            })}
            <div className="flex flex-col">
              <Typography color="text.primary" className="font-medium">
                {row.original.name}
              </Typography>
              <Typography variant="body2">{row.original.email}</Typography>
            </div>
          </div>
        ),
      }),
      columnHelper.accessor("email", {
        header: "Email",
        cell: ({ row }) => <Typography>{row.original.email}</Typography>,
      }),
      columnHelper.accessor("age", {
        header: "Age",
        cell: ({ row }) => (
          <Typography className="capitalize" color="text.primary">
            {row.original.age}
          </Typography>
        ),
      }),
      columnHelper.accessor("region", {
        header: "Region",
        cell: ({ row }) => {
          const region = row.original.region;
          return (
            <div className="flex items-center gap-2">
              <Icon
                className={classnames(
                  "text-[22px]",
                  customerRegionObj[region]?.icon
                )}
                sx={{
                  color: `var(--mui-palette-${customerRegionObj[region]?.color}-main)`,
                }}
              />
              <Typography className="capitalize" color="text.primary">
                {region}
              </Typography>
            </div>
          );
        },
      }),

      columnHelper.accessor("gender", {
        header: "Gender",
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <Chip
              variant="tonal"
              label={row.original.gender}
              size="small"
              color={customerGenderObj[row.original.gender]}
              className="capitalize"
            />
          </div>
        ),
      }),
      columnHelper.accessor("action", {
        header: "Action",
        cell: ({ row }) => (
          <div className="flex items-center gap-0.5">
            <IconButton
              size="small"
              onClick={() => handleDeleteClick(row.original)}
            >
              <i className="ri-delete-bin-7-line text-textSecondary" />
            </IconButton>
          </div>
        ),
        enableSorting: false,
      }),
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data, filteredData]
  );

  const table = useReactTable({
    data: filteredData as CustomerData[],
    columns,
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    state: {
      rowSelection,
      globalFilter,
    },
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
    enableRowSelection: true, //enable row selection for all rows
    // enableRowSelection: row => row.original.age > 18, // or enable row selection conditionally per row
    globalFilterFn: fuzzyFilter,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
  });

  const getAvatar = (params: Pick<CustomerData, "name" | "email">) => {
    const { name, email } = params;

    if (name) {
      return (
        <CustomAvatar skin="light" size={34}>
          {getInitials(name as string)}
        </CustomAvatar>
      );
    }
  };

  const handleDeleteClick = (customer: CustomerData) => {
    setCustomerToDelete(customer);
    setDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (customerToDelete) {
      setLoading(true);
      try {
        await supabase.from("Customer").delete().eq("id", customerToDelete.id);
        onDelete();
      } catch (error) {
        console.error("Error deleting customer:", error);
      } finally {
        setLoading(false);
        setDialogOpen(false);
        setCustomerToDelete(null);
      }
    }
  };

  return (
    <>
      <Card>
        <CardHeader title="Filters" className="pbe-4" />
        <Divider />
        <div className="flex justify-between gap-4 p-5 flex-col items-start sm:flex-row sm:items-center">
          <div className="flex items-center gap-x-4 max-sm:gap-y-4 flex-col max-sm:is-full sm:flex-row">
            <DebouncedInput
              value={globalFilter ?? ""}
              onChange={(value) => setGlobalFilter(String(value))}
              placeholder="Search User"
              className="max-sm:is-full"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className={tableStyles.table}>
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th key={header.id}>
                      {header.isPlaceholder ? null : (
                        <>
                          <div
                            className={classnames({
                              "flex items-center": header.column.getIsSorted(),
                              "cursor-pointer select-none":
                                header.column.getCanSort(),
                            })}
                            onClick={header.column.getToggleSortingHandler()}
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                            {{
                              asc: <i className="ri-arrow-up-s-line text-xl" />,
                              desc: (
                                <i className="ri-arrow-down-s-line text-xl" />
                              ),
                            }[header.column.getIsSorted() as "asc" | "desc"] ??
                              null}
                          </div>
                        </>
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            {table.getFilteredRowModel().rows.length === 0 ? (
              <tbody>
                <tr>
                  <td
                    colSpan={table.getVisibleFlatColumns().length}
                    className="text-center"
                  >
                    No data available
                  </td>
                </tr>
              </tbody>
            ) : (
              <tbody>
                {table
                  .getRowModel()
                  .rows.slice(0, table.getState().pagination.pageSize)
                  .map((row) => {
                    return (
                      <tr
                        key={row.id}
                        className={classnames({
                          selected: row.getIsSelected(),
                        })}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <td key={cell.id}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
              </tbody>
            )}
          </table>
        </div>
        <TablePagination
          rowsPerPageOptions={[10, 25, 50]}
          component="div"
          className="border-bs"
          count={table.getFilteredRowModel().rows.length}
          rowsPerPage={table.getState().pagination.pageSize}
          page={table.getState().pagination.pageIndex}
          SelectProps={{
            inputProps: { "aria-label": "rows per page" },
          }}
          onPageChange={(_, page) => {
            table.setPageIndex(page);
          }}
          onRowsPerPageChange={(e) => table.setPageSize(Number(e.target.value))}
        />
      </Card>
      {/*  <AddUserDrawer
        open={addUserOpen}
        handleClose={() => setAddUserOpen(!addUserOpen)}
        userData={data}
        setData={setData}
      /> */}

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        itemType="customer"
        itemName={customerToDelete?.name}
        operation="delete"
        loading={loading}
      />
    </>
  );
};

export default UserListTable;
