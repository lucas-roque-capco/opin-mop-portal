import MenuIcon from "@mui/icons-material/Menu";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Image from "next/image";
import LogoOpenInsurance from "../../../public/Logo-Open.svg";

export default function Header() {
  return (
    <Box sx={{ display: "flex" }}>
      <AppBar
        position="fixed"
        sx={{ bgcolor: "#fff" }}
        elevation={0}
        style={{ borderBottom: "4px solid #f5f5f5" }}
      >
        <Toolbar>
          <IconButton
            aria-label="menu"
            edge="start"
            sx={{ marginRight: 2, color: "#3c3c3c" }}
            disabled
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <Image
              src={LogoOpenInsurance}
              alt="Logo Open Insurance"
              style={{ marginTop: 10, marginLeft: 0 }}
            />
          </Typography>
          <Typography variant="body2" sx={{ color: "#193F12", fontWeight: 500 }}>
            Erros do MOP
          </Typography>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
