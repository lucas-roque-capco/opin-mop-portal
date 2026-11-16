import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { Box, Button, Menu, MenuItem, Popover, TextField } from "@mui/material";
import { useState } from "react";

export function isoDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function monthsAgo(months: number): { from: string; to: string } {
  const to = new Date();
  const from = new Date();
  from.setMonth(from.getMonth() - months);
  return { from: isoDate(from), to: isoDate(to) };
}

function yearRange(year: number): { from: string; to: string } {
  const today = new Date();
  const end = year === today.getFullYear() ? today : new Date(year, 11, 31);
  return { from: `${year}-01-01`, to: isoDate(end) };
}

export const PERIOD_BUTTON_SX = (active: boolean) => ({
  textTransform: "uppercase" as const,
  fontWeight: 500,
  fontSize: 12,
  letterSpacing: 0.4,
  borderRadius: "4px",
  px: 1.5,
  py: 0.6,
  minHeight: 34,
  color: "#2f6b12",
  bgcolor: active ? "#C8F08A" : "#fff",
  border: "1px solid",
  borderColor: "#7BC432",
  boxShadow: "none",
  "&:hover": {
    bgcolor: active ? "#b8e87b" : "#f3fbe8",
    borderColor: "#60A92F",
    boxShadow: "none",
  },
});

interface PeriodToolbarProps {
  from?: string;
  to?: string;
  onChange: (from?: string, to?: string) => void;
}

export default function PeriodToolbar({ from, to, onChange }: PeriodToolbarProps) {
  const [yearsAnchor, setYearsAnchor] = useState<HTMLElement | null>(null);
  const [periodAnchor, setPeriodAnchor] = useState<HTMLElement | null>(null);
  const currentYear = new Date().getFullYear();
  const years = [0, 1, 2, 3, 4].map((offset) => currentYear - offset);
  const last3 = monthsAgo(3);
  const last6 = monthsAgo(6);
  const activeYear = years.find((year) => {
    const range = yearRange(year);
    return from === range.from && to === range.to;
  });
  const isLast3 = from === last3.from && to === last3.to;
  const isLast6 = from === last6.from && to === last6.to;
  const isCustom = Boolean(from || to) && !isLast3 && !isLast6 && !activeYear;

  return (
    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
      <Button sx={PERIOD_BUTTON_SX(isLast3)} onClick={() => onChange(last3.from, last3.to)}>
        3 meses
      </Button>
      <Button sx={PERIOD_BUTTON_SX(isLast6)} onClick={() => onChange(last6.from, last6.to)}>
        6 meses
      </Button>
      <Button
        sx={PERIOD_BUTTON_SX(Boolean(activeYear))}
        endIcon={<KeyboardArrowDownIcon sx={{ fontSize: 18 }} />}
        onClick={(event) => setYearsAnchor(event.currentTarget)}
        aria-haspopup="menu"
        aria-expanded={Boolean(yearsAnchor)}
      >
        {activeYear ? String(activeYear) : "Anos"}
      </Button>
      <Menu anchorEl={yearsAnchor} open={Boolean(yearsAnchor)} onClose={() => setYearsAnchor(null)}>
        {years.map((year) => (
          <MenuItem
            key={year}
            selected={activeYear === year}
            onClick={() => {
              const range = yearRange(year);
              onChange(range.from, range.to);
              setYearsAnchor(null);
            }}
          >
            {year}
          </MenuItem>
        ))}
      </Menu>
      <Button
        sx={PERIOD_BUTTON_SX(isCustom)}
        startIcon={<CalendarMonthOutlinedIcon sx={{ fontSize: 16 }} />}
        endIcon={<KeyboardArrowRightIcon sx={{ fontSize: 18 }} />}
        onClick={(event) => setPeriodAnchor(event.currentTarget)}
      >
        Selecionar períodos
      </Button>
      <Popover
        open={Boolean(periodAnchor)}
        anchorEl={periodAnchor}
        onClose={() => setPeriodAnchor(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Box sx={{ display: "flex", gap: 1.5, p: 2 }}>
          <TextField
            size="small"
            label="De"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={from || ""}
            onChange={(e) => onChange(e.target.value || undefined, to)}
          />
          <TextField
            size="small"
            label="Até"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={to || ""}
            onChange={(e) => onChange(from, e.target.value || undefined)}
          />
        </Box>
      </Popover>
    </Box>
  );
}
