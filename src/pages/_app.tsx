import { AccessViewProvider, useAccessView } from "@/src/context/AccessView";
import ParticipantNav from "@/src/components/ParticipantNav";
import { theme } from "@/src/styles/theme";
import { Box, CssBaseline, ThemeProvider, Toolbar } from "@mui/material";
import type { AppProps } from "next/app";
import Head from "next/head";
import type { ReactNode } from "react";
import { Footer } from "../components/Footer";
import Header from "../components/Header";
import "../styles/global.css";

function AppShell({ children }: { children: ReactNode }) {
  const { view } = useAccessView();
  const participant = view === "participant";

  return (
    <>
      <Header />
      <Box sx={{ display: "flex", minHeight: "100vh" }}>
        {participant && <ParticipantNav />}
        <Box
          component="main"
          sx={{
            flex: 1,
            minWidth: 0,
            bgcolor: participant ? "#fff" : "#fafafa",
            px: { xs: 2, md: 4 },
            pb: 4,
          }}
        >
          <Toolbar />
          {children}
          {!participant && <Footer />}
        </Box>
      </Box>
    </>
  );
}

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Head>
        <title>Erros e alertas — Open Insurance</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <AccessViewProvider>
        <AppShell>
          <Component {...pageProps} />
        </AppShell>
      </AccessViewProvider>
    </ThemeProvider>
  );
}
