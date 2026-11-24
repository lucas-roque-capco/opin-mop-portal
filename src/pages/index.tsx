import ErrorsFilters, {
  defaultErrorsFilters,
  ErrorsFilterState,
} from "@/src/components/ErrorsFilters";
import ErrorsTable from "@/src/components/ErrorsTable";
import ParticipantDashboard from "@/src/components/ParticipantDashboard";
import ParticipantValidations from "@/src/components/ParticipantValidations";
import { useAccessView } from "@/src/context/AccessView";
import { fetchMopErrors } from "@/src/services/errorsApi";
import type { MopErrorRecord } from "@/src/types/errors";
import {
  Alert,
  Box,
  CircularProgress,
  Typography,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";

export default function ErrorsPage() {
  const { view, participantSection } = useAccessView();
  const [filters, setFilters] = useState<ErrorsFilterState>(defaultErrorsFilters);
  const [applied, setApplied] = useState<ErrorsFilterState>(defaultErrorsFilters);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [data, setData] = useState<MopErrorRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchMopErrors({ ...applied, page, limit });
      setData(res.data || []);
      setTotal(res.total ?? 0);
    } catch (e: unknown) {
      const msg =
        (e as { response?: { data?: { message?: string } }; message?: string })
          ?.response?.data?.message ||
        (e as { message?: string })?.message ||
        "Falha ao carregar erros";
      setError(msg);
      setData([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [applied, page, limit]);

  useEffect(() => {
    if (view !== "mop") return;
    load();
  }, [load, view]);

  if (view === "participant") {
    return (
      <Box sx={{ pt: 3, maxWidth: 1200 }}>
        {participantSection === "dashboard" ? (
          <ParticipantDashboard />
        ) : (
          <ParticipantValidations />
        )}
      </Box>
    );
  }

  return (
    <Box sx={{ pt: 3, maxWidth: 1400, mx: "auto" }}>
      <Typography
        variant="h4"
        sx={{
          fontFamily: "Roboto, Arial, sans-serif",
          color: "#193F12",
          fontWeight: 700,
          mb: 1,
        }}
      >
        Erros e alertas
      </Typography>
      <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
        O que o MOP Server, o MOP Client e as participantes registraram.
      </Typography>

      <ErrorsFilters
        value={filters}
        onChange={setFilters}
        onApply={(next) => {
          setPage(1);
          setFilters(next);
          setApplied(next);
        }}
        onClear={() => {
          const next = defaultErrorsFilters();
          setFilters(next);
          setApplied(next);
          setPage(1);
        }}
      />

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
        <ErrorsTable
          data={data}
          total={total}
          page={page}
          limit={limit}
          onPageChange={setPage}
          onLimitChange={(l) => {
            setLimit(l);
            setPage(1);
          }}
        />
      )}
    </Box>
  );
}
