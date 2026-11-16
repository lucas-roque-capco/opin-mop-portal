import MenuIcon from "@mui/icons-material/Menu";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Image from "next/image";
import { useAccessView, type AccessView } from "@/src/context/AccessView";
import LogoOpenInsurance from "../../../public/Logo-Open.svg";

const VIEWS: { id: AccessView; label: string }[] = [
  { id: "mop", label: "MOP" },
  { id: "participant", label: "Participante" },
];

export default function Header() {
  const { view, setView } = useAccessView();

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar
        position="fixed"
        sx={{ bgcolor: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
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
          <Box sx={{ display: "flex", gap: 1 }}>
            {VIEWS.map((item) => {
              const active = view === item.id;
              return (
                <Button
                  key={item.id}
                  onClick={() => setView(item.id)}
                  variant={active ? "contained" : "outlined"}
                  sx={{
                    textTransform: "none",
                    fontWeight: 500,
                    color: active ? "#fff" : "#193F12",
                    bgcolor: active ? "#8CD23F" : "transparent",
                    borderColor: "#8CD23F",
                    "&:hover": {
                      bgcolor: active ? "#60A92F" : "#f3fbe8",
                      borderColor: "#60A92F",
                    },
                  }}
                >
                  {item.label}
                </Button>
              );
            })}
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
