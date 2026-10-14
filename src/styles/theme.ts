import { createTheme } from "@mui/material";

export const theme = createTheme({
  typography: {
    fontFamily: "Roboto, Blogger Sans, Arial, sans-serif",
    h1: {
      fontFamily: "Blogger Sans, Arial, sans-serif",
    },
    body1: {
      fontFamily: "Roboto, Arial, sans-serif",
    },
  },
  palette: {
    primary: {
      main: "#8CD23F",
      light: "#B8E87B",
      dark: "#60A92F",
      contrastText: "#fff",
    },
    secondary: {
      main: "#193F12",
    },
  },
});
