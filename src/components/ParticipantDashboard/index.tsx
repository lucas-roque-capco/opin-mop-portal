import { Box, Typography } from "@mui/material";
import { useMemo, type ReactNode } from "react";
import type { MopErrorRecord } from "@/src/types/errors";

/** Envios da participante que não geraram item em validations. Ainda não há API de arquivos. */
const FILES_WITHOUT_VALIDATION = 11;

interface ParticipantDashboardProps {
  validations: MopErrorRecord[];
}

function countBy(rows: MopErrorRecord[], key: (row: MopErrorRecord) => string) {
  const map = new Map<string, number>();
  for (const row of rows) {
    const name = key(row) || "Não informado";
    map.set(name, (map.get(name) ?? 0) + 1);
  }
  return [...map.entries()]
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value);
}

function Card({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Box sx={{ p: 2, bgcolor: "#fff", border: "1px solid #e6e6e6", borderRadius: 1, minWidth: 0 }}>
      <Typography variant="subtitle2" sx={{ color: "#193F12", fontWeight: 700, mb: 2 }}>
        {title}
      </Typography>
      {children}
    </Box>
  );
}

function Donut({
  parts,
}: {
  parts: { label: string; value: number; color: string }[];
}) {
  const total = parts.reduce((sum, part) => sum + part.value, 0) || 1;
  const radius = 58;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  return (
    <Box sx={{ display: "flex", gap: 3, alignItems: "center", flexWrap: "wrap" }}>
      <Box component="svg" viewBox="0 0 160 160" sx={{ width: 160, height: 160 }}>
        <circle cx="80" cy="80" r={radius} fill="none" stroke="#f0f0f0" strokeWidth="18" />
        {parts.map((part) => {
          const length = (part.value / total) * circumference;
          const dash = `${length} ${circumference - length}`;
          const circle = (
            <circle
              key={part.label}
              cx="80"
              cy="80"
              r={radius}
              fill="none"
              stroke={part.color}
              strokeWidth="18"
              strokeDasharray={dash}
              strokeDashoffset={-offset}
              transform="rotate(-90 80 80)"
            />
          );
          offset += length;
          return circle;
        })}
        <text x="80" y="76" textAnchor="middle" fontSize="22" fontWeight="700" fill="#193F12">
          {total}
        </text>
        <text x="80" y="96" textAnchor="middle" fontSize="11" fill="#6b6b6b">
          arquivos
        </text>
      </Box>
      <Box>
        {parts.map((part) => (
          <Box key={part.label} sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
            <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: part.color }} />
            <Typography variant="body2">
              {part.label}: <strong>{part.value}</strong> (
              {Math.round((part.value / total) * 100)}%)
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

function Bars({ items, color }: { items: { label: string; value: number }[]; color: string }) {
  const max = Math.max(...items.map((item) => item.value), 1);
  if (items.length === 0) {
    return <Typography variant="body2" color="text.secondary">Nenhuma validação no período.</Typography>;
  }
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1.25 }}>
      {items.map((item) => (
        <Box key={item.label}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.4, gap: 1 }}>
            <Typography variant="body2" sx={{ color: "#1a1a1a" }} noWrap title={item.label}>
              {item.label}
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 700, color: "#193F12" }}>
              {item.value}
            </Typography>
          </Box>
          <Box sx={{ height: 8, bgcolor: "#f3f3f3", borderRadius: 4 }}>
            <Box
              sx={{
                height: "100%",
                width: `${(item.value / max) * 100}%`,
                bgcolor: color,
                borderRadius: 4,
              }}
            />
          </Box>
        </Box>
      ))}
    </Box>
  );
}

export default function ParticipantDashboard({ validations }: ParticipantDashboardProps) {
  const stats = useMemo(() => {
    const filesWithValidation = new Set(
      validations.map((row) => row.correlationId).filter(Boolean),
    ).size;
    const byType = countBy(validations, (row) => row.message);
    const byPath = countBy(validations, (row) => row.path || "Sem path");
    const errors = validations.filter((row) => row.severity === "ERROR").length;
    const warnings = validations.filter((row) => row.severity === "WARNING").length;
    return {
      sent: filesWithValidation + FILES_WITHOUT_VALIDATION,
      withValidation: filesWithValidation,
      clean: FILES_WITHOUT_VALIDATION,
      byType,
      byPath,
      errors,
      warnings,
    };
  }, [validations]);

  return (
    <Box>
      <Typography variant="body2" sx={{ color: "#8a8a8a", mb: 0.5 }}>
        Minhas validações / Dashboard
      </Typography>
      <Typography variant="h4" sx={{ fontWeight: 700, color: "#193F12", mb: 1 }}>
        Validações dos arquivos
      </Typography>
      <Typography variant="body2" sx={{ color: "#5c5c5c", mb: 3 }}>
        Acompanha os arquivos enviados pela participante e as validações geradas em cada chamada.
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          gap: 2,
        }}
      >
        <Card title="Arquivos enviados x com validação">
          <Donut
            parts={[
              { label: "Sem validação", value: stats.clean, color: "#8CD23F" },
              { label: "Com validação", value: stats.withValidation, color: "#193F12" },
            ]}
          />
        </Card>
        <Card title="Situação das validações">
          <Bars
            color="#60A92F"
            items={[
              { label: "Erro", value: stats.errors },
              { label: "Alerta", value: stats.warnings },
            ]}
          />
        </Card>
        <Card title="Tipos de validação mais frequentes">
          <Bars color="#193F12" items={stats.byType.slice(0, 6)} />
        </Card>
        <Card title="Validações por endpoint">
          <Bars color="#8CD23F" items={stats.byPath.slice(0, 6)} />
        </Card>
      </Box>
    </Box>
  );
}
