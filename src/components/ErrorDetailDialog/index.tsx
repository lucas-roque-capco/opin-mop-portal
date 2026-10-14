import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid2 as Grid,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import type { ReactNode } from "react";
import type { MopErrorRecord } from "@/src/types/errors";
import { labelFor, labelForErrorCode } from "@/src/utils/errorLabels";

interface ErrorDetailDialogProps {
  error: MopErrorRecord | null;
  onClose: () => void;
}

function Field({
  label,
  value,
  mono,
}: {
  label: string;
  value: ReactNode;
  mono?: boolean;
}) {
  const display =
    value === true ? "Sim" : value === false ? "Não" : (value ?? "—");
  const isEmpty = display === "—" || display === "";

  return (
    <Box sx={{ mb: 1.5 }}>
      <Typography
        variant="caption"
        sx={{
          color: "#6b6b6b",
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: 0.3,
        }}
      >
        {label}
      </Typography>
      <Typography
        variant="body2"
        sx={{
          mt: 0.25,
          color: isEmpty ? "text.disabled" : "#193F12",
          fontFamily: mono ? "monospace" : "inherit",
          fontSize: mono ? 12 : undefined,
          wordBreak: "break-word",
        }}
      >
        {display}
      </Typography>
    </Box>
  );
}

function JsonBlock({ title, data }: { title: string; data: unknown }) {
  const text =
    data == null ? "Nenhum dado disponível." : JSON.stringify(data, null, 2);

  const copy = async () => {
    if (data == null) return;
    try {
      await navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    } catch {
      /* ignore */
    }
  };

  return (
    <Accordion
      disableGutters
      elevation={0}
      sx={{
        border: "1px solid #e6e6e6",
        borderRadius: "4px !important",
        "&:before": { display: "none" },
        bgcolor: "#fff",
      }}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="subtitle2" sx={{ color: "#193F12", fontWeight: 600 }}>
          {title}
        </Typography>
      </AccordionSummary>
      <AccordionDetails sx={{ pt: 0 }}>
        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 1 }}>
          <Tooltip title="Copiar JSON">
            <span>
              <IconButton
                size="small"
                onClick={copy}
                disabled={data == null}
                aria-label="copiar json"
              >
                <ContentCopyIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
        </Box>
        <Box
          component="pre"
          sx={{
            m: 0,
            p: 1.5,
            bgcolor: "#f5f5f5",
            borderRadius: 1,
            fontSize: 12,
            overflow: "auto",
            maxHeight: 320,
            fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
          }}
        >
          {text}
        </Box>
      </AccordionDetails>
    </Accordion>
  );
}

function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <Typography
      variant="subtitle2"
      sx={{ color: "#193F12", fontWeight: 700, mb: 1.5, mt: 0.5 }}
    >
      {children}
    </Typography>
  );
}

export default function ErrorDetailDialog({
  error,
  onClose,
}: ErrorDetailDialogProps) {
  return (
    <Dialog open={!!error} onClose={onClose} maxWidth="md" fullWidth>
      {error && (
        <>
          <DialogTitle sx={{ pb: 1 }}>
            <Typography
              component="div"
              variant="h6"
              sx={{ color: "#193F12", fontWeight: 700, pr: 2 }}
            >
              {labelForErrorCode(error.errorCode)}
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ fontFamily: "monospace", display: "block", mt: 0.5 }}
            >
              {error.errorCode}
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1.5 }}>
              <Chip
                size="small"
                label={labelFor("severity", error.severity)}
                color={error.severity === "ERROR" ? "error" : "warning"}
              />
              <Chip
                size="small"
                variant="outlined"
                label={`Criticidade: ${labelFor("criticality", error.criticality)}`}
              />
              <Chip
                size="small"
                variant="outlined"
                label={labelFor("errorType", error.errorType)}
              />
              <Chip
                size="small"
                color={error.mopClientVisible ? "primary" : "default"}
                variant={error.mopClientVisible ? "filled" : "outlined"}
                label={
                  error.mopClientVisible
                    ? "Visível ao MOP Client"
                    : "Somente interno"
                }
              />
              {error.httpStatus != null && (
                <Chip size="small" variant="outlined" label={`HTTP ${error.httpStatus}`} />
              )}
            </Box>
          </DialogTitle>

          <DialogContent dividers sx={{ bgcolor: "#fafafa" }}>
            <Box
              sx={{
                p: 2,
                mb: 2,
                bgcolor: "#fff",
                border: "1px solid #e6e6e6",
                borderRadius: 1,
              }}
            >
              <SectionTitle>Mensagem</SectionTitle>
              <Typography variant="body1" sx={{ color: "#3c3c3c" }}>
                {error.message}
              </Typography>
            </Box>

            <Box
              sx={{
                p: 2,
                mb: 2,
                bgcolor: "#fff",
                border: "1px solid #e6e6e6",
                borderRadius: 1,
              }}
            >
              <SectionTitle>Identificação</SectionTitle>
              <Grid container spacing={1}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Field
                    label="Data/hora"
                    value={new Date(error.timestamp).toLocaleString("pt-BR")}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Field label="ID do registro" value={error.id} mono />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Field label="Organização (orgId)" value={error.orgId} mono />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Field label="Correlation ID" value={error.correlationId} mono />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Field label="Trace ID" value={error.traceId} mono />
                </Grid>
              </Grid>
            </Box>

            <Box
              sx={{
                p: 2,
                mb: 2,
                bgcolor: "#fff",
                border: "1px solid #e6e6e6",
                borderRadius: 1,
              }}
            >
              <SectionTitle>Origem</SectionTitle>
              <Grid container spacing={1}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Field label="Microserviço" value={labelFor("service", error.service)} />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Field label="Domínio" value={labelFor("domain", error.domain)} />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Field label="Escopo" value={labelFor("scope", error.scope)} />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Field label="Componente" value={error.component} mono />
                </Grid>
              </Grid>
            </Box>

            <Box
              sx={{
                p: 2,
                mb: 2,
                bgcolor: "#fff",
                border: "1px solid #e6e6e6",
                borderRadius: 1,
              }}
            >
              <SectionTitle>Requisição / contexto HTTP</SectionTitle>
              <Grid container spacing={1}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Field label="Path" value={error.path} mono />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Field label="Operação (método)" value={error.operation} />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Field label="Tipo HTTP (httpType)" value={error.httpType} />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Field label="Origin" value={error.origin} />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Field
                    label="Status HTTP ao Client"
                    value={error.httpStatus != null ? String(error.httpStatus) : "—"}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Field
                    label="Visível ao MOP Client"
                    value={error.mopClientVisible}
                  />
                </Grid>
              </Grid>
            </Box>

            {(error.pcmIntegration || error.pcmAction) && (
              <Box
                sx={{
                  p: 2,
                  mb: 2,
                  bgcolor: "#fff",
                  border: "1px solid #e6e6e6",
                  borderRadius: 1,
                }}
              >
                <SectionTitle>Integração PCM</SectionTitle>
                <Grid container spacing={1}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Field
                      label="Integração"
                      value={labelFor("pcmIntegration", error.pcmIntegration)}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Field
                      label="Ação"
                      value={labelFor("pcmAction", error.pcmAction)}
                    />
                  </Grid>
                </Grid>
              </Box>
            )}

            <Divider sx={{ my: 2 }} />

            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              <JsonBlock title="Detalhes técnicos (details)" data={error.details} />
              <JsonBlock title="Payload completo (requestDto)" data={error.requestDto} />
            </Box>
          </DialogContent>

          <DialogActions sx={{ px: 3, py: 2 }}>
            <Button
              onClick={onClose}
              variant="contained"
              color="primary"
              sx={{ textTransform: "none", fontWeight: 600 }}
            >
              Fechar
            </Button>
          </DialogActions>
        </>
      )}
    </Dialog>
  );
}
