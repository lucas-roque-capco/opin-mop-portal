import DeleteIcon from "@mui/icons-material/Delete";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import {
  Alert,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import PeriodToolbar, { monthsAgo, PERIOD_BUTTON_SX } from "@/src/components/PeriodToolbar";
import { fetchParticipantErrors } from "@/src/services/errorsApi";
import type { MopErrorRecord } from "@/src/types/errors";

const HEADERS = ["Data/hora", "Código", "Validação", "Endpoint", "Situação"];

function requestBody(row: MopErrorRecord): unknown {
  if (row.requestDto) return row.requestDto;
  return {
    trace: {
      correlationId: row.correlationId,
      traceId: row.traceId,
      path: row.path,
      operation: row.operation,
      origin: row.origin,
    },
    validations: [
      {
        violation: row.message,
        code: row.errorCode,
        severity: row.severity,
        attribute: row.details?.attribute ?? "",
      },
    ],
  };
}

const initialPeriod = monthsAgo(3);

export default function ParticipantValidations() {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [severity, setSeverity] = useState("");
  const [code, setCode] = useState("");
  const [from, setFrom] = useState(initialPeriod.from);
  const [to, setTo] = useState(initialPeriod.to);
  const [applied, setApplied] = useState({
    severity: "",
    code: "",
    from: initialPeriod.from,
    to: initialPeriod.to,
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [rows, setRows] = useState<MopErrorRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [codes, setCodes] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [selected, setSelected] = useState<MopErrorRecord | null>(null);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(
    null,
  );

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setLoadError(null);
    fetchParticipantErrors({
      from: applied.from || undefined,
      to: applied.to || undefined,
      severity: applied.severity || undefined,
      errorCode: applied.code || undefined,
      page: page + 1,
      limit: rowsPerPage,
    })
      .then((res) => {
        if (cancelled) return;
        setRows(res.data || []);
        setTotal(res.total ?? 0);
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        const message =
          (error as { response?: { data?: { message?: string } }; message?: string })
            ?.response?.data?.message ||
          (error as { message?: string })?.message ||
          "Falha ao carregar validações";
        setLoadError(message);
        setRows([]);
        setTotal(0);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [applied, page, rowsPerPage]);

  useEffect(() => {
    let cancelled = false;
    fetchParticipantErrors({
      from: applied.from || undefined,
      to: applied.to || undefined,
      page: 1,
      limit: 100,
    })
      .then((res) => {
        if (cancelled) return;
        setCodes([...new Set((res.data || []).map((row) => row.errorCode))].sort());
      })
      .catch(() => {
        if (!cancelled) setCodes([]);
      });
    return () => {
      cancelled = true;
    };
  }, [applied.from, applied.to]);

  const open = (row: MopErrorRecord) => {
    setSelected(row);
    setDraft(JSON.stringify(requestBody(row), null, 2));
    setFeedback(null);
  };

  const resend = async () => {
    let parsed: unknown;
    try {
      parsed = JSON.parse(draft);
    } catch {
      setFeedback({ type: "error", text: "O corpo não é um JSON válido." });
      return;
    }
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      setFeedback({ type: "error", text: "O corpo precisa ser um objeto JSON." });
      return;
    }
    setSending(true);
    setFeedback(null);
    try {
      const { data: result } = await axios.post<{ message: string }>("/api/participant/resend", parsed);
      setFeedback({ type: "success", text: result.message || "Chamada reenviada." });
    } catch (error: unknown) {
      const detail = (error as { response?: { data?: { detail?: string; message?: string } } })
        ?.response?.data;
      setFeedback({
        type: "error",
        text: detail?.detail || detail?.message || "Não foi possível reenviar a chamada.",
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <Box>
      <Typography variant="body2" sx={{ color: "#8a8a8a", mb: 0.5 }}>
        Minhas validações / Listagem
      </Typography>
      <Typography variant="h4" sx={{ fontWeight: 700, color: "#193F12", mb: 1 }}>
        Validações
      </Typography>
      <Typography variant="body2" sx={{ color: "#5c5c5c", mb: 2 }}>
        Validações geradas pelos arquivos enviados. Abra uma linha para ver o corpo da chamada, editar e enviar de novo.
      </Typography>

      <Box sx={{ mb: 2 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 1.5,
            flexWrap: "wrap",
            mb: 1.5,
          }}
        >
          <PeriodToolbar
            from={from}
            to={to}
            onChange={(nextFrom, nextTo) => {
              setFrom(nextFrom || "");
              setTo(nextTo || "");
              setApplied((current) => ({
                ...current,
                from: nextFrom || "",
                to: nextTo || "",
              }));
              setPage(0);
            }}
          />
          <Button
            variant="outlined"
            disableElevation
            startIcon={<FilterAltIcon sx={{ fontSize: 18 }} />}
            onClick={() => setFiltersOpen((current) => !current)}
            aria-expanded={filtersOpen}
            sx={{
              ...PERIOD_BUTTON_SX(filtersOpen),
              "& .MuiButton-startIcon": { color: "#2f6b12", marginRight: "6px" },
            }}
          >
            Filtros
          </Button>
        </Box>
        {filtersOpen && (
          <>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                gap: 1.5,
              }}
            >
              <FormControl size="small" fullWidth sx={{ bgcolor: "#fff" }}>
                <InputLabel shrink>Situação</InputLabel>
                <Select
                  displayEmpty
                  notched
                  label="Situação"
                  value={severity}
                  onChange={(e) => setSeverity(String(e.target.value))}
                >
                  <MenuItem value="">Todas</MenuItem>
                  <MenuItem value="ERROR">Erro</MenuItem>
                  <MenuItem value="WARNING">Alerta</MenuItem>
                </Select>
              </FormControl>
              <FormControl size="small" fullWidth sx={{ bgcolor: "#fff" }}>
                <InputLabel shrink>Código da validação</InputLabel>
                <Select
                  displayEmpty
                  notched
                  label="Código da validação"
                  value={code}
                  onChange={(e) => setCode(String(e.target.value))}
                >
                  <MenuItem value="">Todos</MenuItem>
                  {codes.map((item) => (
                    <MenuItem key={item} value={item}>
                      {item}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1, mt: 1.5 }}>
              <Button
                variant="outlined"
                onClick={() => {
                  setApplied({ severity, code, from, to });
                  setPage(0);
                }}
                sx={PERIOD_BUTTON_SX(true)}
              >
                Filtrar
              </Button>
              <Button
                onClick={() => {
                  const next = monthsAgo(3);
                  setSeverity("");
                  setCode("");
                  setFrom(next.from);
                  setTo(next.to);
                  setApplied({ severity: "", code: "", from: next.from, to: next.to });
                  setPage(0);
                }}
                startIcon={<DeleteIcon sx={{ fontSize: 16 }} />}
                sx={{
                  textTransform: "uppercase",
                  fontWeight: 500,
                  fontSize: 12,
                  letterSpacing: 0.4,
                  color: "#1a1a1a",
                }}
              >
                Limpar filtros
              </Button>
            </Box>
          </>
        )}
      </Box>

      {loadError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {loadError}
        </Alert>
      )}

      <TableContainer sx={{ border: "1px solid #e6e6e6", borderRadius: 1, bgcolor: "#fff" }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              {HEADERS.map((header) => (
                <TableCell key={header} sx={{ fontWeight: 700, bgcolor: "#f5f5f5", color: "#193F12" }}>
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={HEADERS.length} align="center" sx={{ py: 4 }}>
                  Carregando...
                </TableCell>
              </TableRow>
            ) : rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={HEADERS.length} align="center" sx={{ py: 4 }}>
                  Nenhuma validação encontrada.
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row) => (
                <TableRow key={row.id} hover onClick={() => open(row)} sx={{ cursor: "pointer" }}>
                  <TableCell sx={{ whiteSpace: "nowrap" }}>
                    {new Date(row.timestamp).toLocaleString("pt-BR")}
                  </TableCell>
                  <TableCell sx={{ fontFamily: "monospace", fontSize: 12 }}>{row.errorCode}</TableCell>
                  <TableCell sx={{ maxWidth: 360 }}>{row.message}</TableCell>
                  <TableCell>{[row.operation, row.path].filter(Boolean).join(" ") || "—"}</TableCell>
                  <TableCell>
                    <Chip
                      size="small"
                      label={row.severity === "WARNING" ? "Alerta" : "Erro"}
                      color={row.severity === "WARNING" ? "warning" : "error"}
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={total}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={(_, next) => setPage(next)}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
          rowsPerPageOptions={[10, 20, 50]}
          labelRowsPerPage="Itens por página:"
          labelDisplayedRows={({ from, to, count }) => `${from}–${to} de ${count}`}
        />
      </TableContainer>

      <Dialog open={!!selected} onClose={() => setSelected(null)} maxWidth="md" fullWidth>
        {selected && (
          <>
            <DialogTitle sx={{ color: "#193F12", fontWeight: 700 }}>
              {selected.message}
              <Typography variant="caption" display="block" sx={{ fontFamily: "monospace", fontWeight: 400, mt: 0.5 }}>
                código {selected.errorCode}
              </Typography>
            </DialogTitle>
            <DialogContent dividers>
              <Typography variant="body2" sx={{ color: "#5c5c5c", mb: 1.5 }}>
                Corpo da chamada enviada. Edite o JSON e reenvie para o MOP.
              </Typography>
              {feedback && (
                <Alert severity={feedback.type} sx={{ mb: 1.5 }}>
                  {feedback.text}
                </Alert>
              )}
              <TextField
                fullWidth
                multiline
                minRows={16}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                sx={{
                  "& textarea": {
                    fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                    fontSize: 12,
                  },
                }}
              />
            </DialogContent>
            <DialogActions sx={{ px: 3, py: 2 }}>
              <Button onClick={() => setSelected(null)} sx={{ textTransform: "none", color: "#193F12" }}>
                Fechar
              </Button>
              <Button
                variant="contained"
                disabled={sending}
                onClick={resend}
                sx={{
                  textTransform: "none",
                  fontWeight: 500,
                  bgcolor: "#8CD23F",
                  color: "#193F12",
                  "&:hover": { bgcolor: "#60A92F" },
                }}
              >
                {sending ? "Enviando..." : "Enviar novamente"}
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
}
