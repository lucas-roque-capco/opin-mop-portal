import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import FactCheckOutlinedIcon from "@mui/icons-material/FactCheckOutlined";
import { Box, Button, Typography } from "@mui/material";
import { useAccessView, type ParticipantSection } from "@/src/context/AccessView";

const ITEMS: { id: ParticipantSection; label: string; icon: typeof DashboardOutlinedIcon }[] = [
  { id: "dashboard", label: "Dashboard", icon: DashboardOutlinedIcon },
  { id: "validations", label: "Validações", icon: FactCheckOutlinedIcon },
];

export default function ParticipantNav() {
  const { participantSection, setParticipantSection } = useAccessView();

  return (
    <Box
      component="nav"
      sx={{
        width: 260,
        flexShrink: 0,
        bgcolor: "#f6f6f6",
        borderRight: "1px solid #ececec",
        minHeight: "100vh",
        pt: "80px",
        px: 1.5,
      }}
    >
      <Typography
        variant="caption"
        sx={{
          display: "block",
          px: 1.5,
          mb: 1,
          color: "#8a8a8a",
          fontWeight: 700,
          letterSpacing: 0.8,
        }}
      >
        MINHAS VALIDAÇÕES
      </Typography>
      {ITEMS.map((item) => {
        const active = participantSection === item.id;
        const Icon = item.icon;
        return (
          <Button
            key={item.id}
            onClick={() => setParticipantSection(item.id)}
            startIcon={<Icon fontSize="small" />}
            sx={{
              justifyContent: "flex-start",
              width: "100%",
              mb: 0.5,
              px: 1.5,
              py: 1.1,
              borderRadius: 1,
              textTransform: "none",
              fontWeight: 600,
              fontSize: 14,
              color: "#193F12",
              bgcolor: active ? "#D7F0B4" : "transparent",
              "&:hover": { bgcolor: active ? "#D7F0B4" : "#ececec" },
            }}
          >
            {item.label}
          </Button>
        );
      })}
    </Box>
  );
}
