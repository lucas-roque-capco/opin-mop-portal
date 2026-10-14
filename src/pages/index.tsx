import ErrorsFilters, {
  ErrorsFilterState,
} from "@/src/components/ErrorsFilters";
import ErrorsTable from "@/src/components/ErrorsTable";
import { fetchErrors } from "@/src/services/errorsApi";
import type { MopErrorRecord } from "@/src/types/errors";
import {
  Alert,
  Box,
  CircularProgress,
  Typography,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";

const EMPTY_FILTERS: ErrorsFilterState = {};

export default function ErrorsPage() {
  const [filters, setFilters] = useState<ErrorsFilterState>(EMPTY_FILTERS);
  const [applied, setApplied] = useState<ErrorsFilterState>(EMPTY_FILTERS);
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
      const res = await fetchErrors({
        ...applied,
        page,
        limit,
      });
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
    load();
  }, [load]);

  return (
    <Box sx={{ pt: 3, maxWidth: 1400, mx: "auto" }}>
      <Typography
        variant="h4"
        sx={{
          fontFamily: "Blogger Sans, Arial, sans-serif",
          color: "#193F12",
          fontWeight: 700,
          mb: 1,
        }}
      >
        Erros do MOP
      </Typography>
      <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
        Listagem dos erros e warnings registrados pelo microserviço{" "}
        <strong>mop-server-errors</strong>.
      </Typography>

      <ErrorsFilters
        value={filters}
        onChange={setFilters}
        onApply={() => {
          setPage(1);
          setApplied({ ...filters });
        }}
        onClear={() => {
          setFilters(EMPTY_FILTERS);
          setApplied(EMPTY_FILTERS);
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
