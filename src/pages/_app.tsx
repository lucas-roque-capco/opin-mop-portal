import { theme } from "@/src/styles/theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import type { AppProps } from "next/app";
import Head from "next/head";
import { Footer } from "../components/Footer";
import Header from "../components/Header";
import "../styles/global.css";
import { Box, Toolbar } from "@mui/material";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Head>
        <title>Erros do MOP — Open Insurance</title>
      </Head>
      <Header />
      <Box
        component="main"
        sx={{
          minHeight: "100vh",
          bgcolor: "#fafafa",
          px: { xs: 2, md: 4 },
          pb: 4,
        }}
      >
        <Toolbar />
        <Component {...pageProps} />
        <Footer />
      </Box>
    </ThemeProvider>
  );
}
