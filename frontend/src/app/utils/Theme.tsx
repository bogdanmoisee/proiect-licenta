import { GlobalStyles, createTheme } from "@mui/material";

export const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#1976d2",
    },
  },
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#1976d2",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#1976d2",
          },
        },
        notchedOutline: {
          borderColor: "#ffffff",
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: "#ffffff",
          "&.Mui-focused": {
            color: "#1976d2",
          },
        },
      },
    },
  },
});

export const globalStyles = (
  <GlobalStyles
    styles={{
      "input:-webkit-autofill": {
        WebkitBoxShadow: "0 0 0 2000px #242526 inset",
        WebkitTextFillColor: "white",
      },
    }}
  />
);
