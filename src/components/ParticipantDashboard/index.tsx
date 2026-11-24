import { Alert, Box, CircularProgress, Typography } from "@mui/material";
import { useEffect, useState, type ReactNode } from "react";
import {
  fetchParticipantSummary,
  type ParticipantSummary,
} from "@/src/services/errorsApi";

/** Envios da participante que não geraram item em validations. Ainda não há API de arquivos. */
const FILES_WITHOUT_VALIDATION = 11;

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

export default function ParticipantDashboard() {
  const [summary, setSummary] = useState<ParticipantSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetchParticipantSummary({})
      .then((data) => {
        if (!cancelled) setSummary(data);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        const message =
          (err as { response?: { data?: { message?: string } }; message?: string })
            ?.response?.data?.message ||
          (err as { message?: string })?.message ||
          "Falha ao carregar o dashboard";
        setError(message);
        setSummary(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const stats = {
    withValidation: summary?.filesWithValidation ?? 0,
    clean: FILES_WITHOUT_VALIDATION,
    byType: summary?.byMessage ?? [],
    byPath: summary?.byPath ?? [],
    errors: summary?.errors ?? 0,
    warnings: summary?.warnings ?? 0,
  };

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

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
          <CircularProgress sx={{ color: "#8CD23F" }} />
        </Box>
      ) : (
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
      )}
    </Box>
  );
}
