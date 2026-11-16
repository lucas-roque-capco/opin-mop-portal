import {
  Box,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from "@mui/material";
import { useState } from "react";
import ErrorDetailDialog from "@/src/components/ErrorDetailDialog";
import type { MopErrorRecord } from "@/src/types/errors";
import { labelFor, resolveErrorOrigin } from "@/src/utils/errorLabels";

const HEADERS = [
  "Data/hora",
  "Origem",
  "Severidade",
  "Criticidade",
  "HTTP",
  "Organização",
  "Correlation ID",
];

interface ErrorsTableProps {
  data: MopErrorRecord[];
  total: number;
  page: number;
  limit: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
}

function severityColor(severity: string): "error" | "warning" | "default" {
  if (severity === "ERROR") return "error";
  if (severity === "WARNING") return "warning";
  return "default";
}

export default function ErrorsTable({
  data,
  total,
  page,
  limit,
  onPageChange,
  onLimitChange,
}: ErrorsTableProps) {
  const [selected, setSelected] = useState<MopErrorRecord | null>(null);

  return (
    <Box>
      <TableContainer
        sx={{
          border: "1px solid #e6e6e6",
          borderRadius: 1,
          bgcolor: "#fff",
        }}
      >
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              {HEADERS.map((h) => (
                <TableCell
                  key={h || "actions"}
                  sx={{
                    fontWeight: 700,
                    bgcolor: "#f5f5f5",
                    color: "#193F12",
                    whiteSpace: "nowrap",
                  }}
                >
                  {h}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={HEADERS.length} align="center" sx={{ py: 4 }}>
                  Nenhum erro encontrado com os filtros atuais.
                </TableCell>
              </TableRow>
            ) : (
              data.map((row) => (
                <TableRow
                  key={row.id}
                  hover
                  onClick={() => setSelected(row)}
                  sx={{ cursor: "pointer" }}
                >
                  <TableCell sx={{ whiteSpace: "nowrap" }}>
                    {new Date(row.timestamp).toLocaleString("pt-BR")}
                  </TableCell>
                  <TableCell sx={{ whiteSpace: "nowrap" }}>
                    {labelFor("errorOrigin", resolveErrorOrigin(row.errorOrigin))}
                  </TableCell>
                  <TableCell>
                    <Chip
                      size="small"
                      label={labelFor("severity", row.severity)}
                      color={severityColor(row.severity)}
                    />
                  </TableCell>
                  <TableCell>{labelFor("criticality", row.criticality)}</TableCell>
                  <TableCell>{row.httpStatus ?? "—"}</TableCell>
                  <TableCell
                    sx={{
                      maxWidth: 140,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      fontFamily: "monospace",
                      fontSize: 12,
                    }}
                    title={row.orgId ?? undefined}
                  >
                    {row.orgId}
                  </TableCell>
                  <TableCell
                    sx={{
                      maxWidth: 160,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      fontFamily: "monospace",
                      fontSize: 12,
                    }}
                    title={row.correlationId ?? undefined}
                  >
                    {row.correlationId ?? "—"}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[10, 15, 20, 50]}
          component="div"
          count={total}
          rowsPerPage={limit}
          page={Math.max(0, page - 1)}
          onPageChange={(_, newPage) => onPageChange(newPage + 1)}
          onRowsPerPageChange={(e) => {
            onLimitChange(parseInt(e.target.value, 10));
            onPageChange(1);
          }}
          labelRowsPerPage="Itens por página:"
          labelDisplayedRows={({ from, to, count }) => {
            const totalCount = count !== -1 ? count : `mais de ${to}`;
            return `${from}–${to} de ${totalCount}`;
          }}
        />
      </TableContainer>

      <ErrorDetailDialog error={selected} onClose={() => setSelected(null)} />
    </Box>
  );
}
