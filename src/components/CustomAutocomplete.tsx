import React from "react";
import { Autocomplete, TextField } from "@mui/material";

interface CustomAutocompleteProps {
  value: string;
  onChange: (event: React.ChangeEvent<{}>, newValue: string | null) => void;
  options: string[];
  label: string;
  icon: React.ReactNode;
}

const CustomAutocomplete: React.FC<CustomAutocompleteProps> = ({
  value,
  onChange,
  options,
  label,
  icon,
}) => (
  <Autocomplete
    value={value}
    onChange={onChange}
    options={options}
    renderInput={(params) => (
      <TextField
        {...params}
        label={label}
        variant="outlined"
        InputProps={{
          ...params.InputProps,
          startAdornment: icon,
        }}
      />
    )}
    fullWidth
  />
);

export default CustomAutocomplete;
