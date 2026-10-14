import { Box, Divider, Typography } from "@mui/material";
import Image from "next/image";
import Logo from "../../../public/Logo-Open.svg";

export function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        paddingTop: "20px",
        paddingBottom: "20px",
        textAlign: "center",
      }}
    >
      <Divider />
      <Image
        src={Logo}
        alt="Logo"
        style={{ maxWidth: "150px", marginBottom: "10px", marginTop: "20px" }}
      />
      <Typography
        variant="body2"
        color="textSecondary"
        sx={{ fontSize: "14px" }}
      >
        @ 2026 Open Insurance. Todos os direitos reservados.
      </Typography>
    </Box>
  );
}
