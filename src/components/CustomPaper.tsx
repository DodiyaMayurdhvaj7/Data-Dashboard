import React from "react";
import { Paper, Typography } from "@mui/material";

interface CustomPaperProps {
  icon: React.ReactNode;
  title: string;
  value: string | number;
}

const CustomPaper: React.FC<CustomPaperProps> = ({ icon, title, value }) => (
  <Paper
    sx={{
      padding: "2rem",
      textAlign: "center",
      borderRadius: "8px",
      boxShadow: 3,
    }}
  >
    {icon}
    <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
      {title}
    </Typography>
    <Typography variant="h4" sx={{ fontWeight: 700 }}>
      {value}
    </Typography>
  </Paper>
);

export default CustomPaper;
