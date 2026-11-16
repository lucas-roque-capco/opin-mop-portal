import DeleteIcon from "@mui/icons-material/Delete";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useState } from "react";
import PeriodToolbar, { monthsAgo, PERIOD_BUTTON_SX } from "@/src/components/PeriodToolbar";
import type { ListErrorsParams } from "@/src/types/errors";
import {
  CRITICALITY_OPTIONS,
  DOMAIN_OPTIONS,
  ERROR_ORIGIN_OPTIONS,
  ERROR_TYPE_OPTIONS,
  errorCodesForOrigin,
  FilterOption,
  MOP_CLIENT_VISIBLE_OPTIONS,
  PCM_INTEGRATION_OPTIONS,
  SCOPE_OPTIONS,
  SERVICE_OPTIONS,
  SEVERITY_OPTIONS,
} from "@/src/utils/errorLabels";

export type ErrorsFilterState = Omit<ListErrorsParams, "page" | "limit">;

export function defaultErrorsFilters(): ErrorsFilterState {
  const range = monthsAgo(3);
  return { from: range.from, to: range.to };
}

interface ErrorsFiltersProps {
  value: ErrorsFilterState;
  onChange: (next: ErrorsFilterState) => void;
  onApply: (next: ErrorsFilterState) => void;
  onClear: () => void;
}

const selectSx = { width: "100%", minWidth: 0, bgcolor: "#fff" };

const fieldGridSx = {
  display: "grid",
  gridTemplateColumns: {
    xs: "1fr",
    sm: "1fr 1fr",
    md: "repeat(4, minmax(0, 1fr))",
  },
  gap: 1.5,
  alignItems: "center",
};

/** Campos do catálogo interno. Não descrevem erro do MOP Client nem validação da participante. */
const SERVER_ONLY_FIELDS: (keyof ErrorsFilterState)[] = [
  "errorType",
  "service",
  "domain",
  "scope",
  "pcmIntegration",
  "mopClientVisible",
];

function withoutServerFilters(next: ErrorsFilterState): ErrorsFilterState {
  if (next.errorOrigin === "MOP_SERVER") return next;
  const cleaned: ErrorsFilterState = { ...next };
  for (const field of SERVER_ONLY_FIELDS) {
    delete cleaned[field];
  }
  return cleaned;
}

function FilterSelect({
  label,
  field,
  options,
  value,
  onChange,
  disabled = false,
}: {
  label: string;
  field: keyof ErrorsFilterState;
  options: FilterOption[];
  value: ErrorsFilterState;
  onChange: (next: ErrorsFilterState) => void;
  disabled?: boolean;
}) {
  return (
    <FormControl size="small" sx={selectSx} disabled={disabled}>
      <InputLabel>{label}</InputLabel>
      <Select
        label={label}
        value={value[field] || ""}
        disabled={disabled}
        onChange={(e) =>
          onChange({ ...value, [field]: e.target.value || undefined })
        }
      >
        <MenuItem value="">
          <em>Todos</em>
        </MenuItem>
        {options.map((opt) => (
          <MenuItem key={opt.value} value={opt.value}>
            {opt.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export default function ErrorsFilters({
  value,
  onChange,
  onApply,
  onClear,
}: ErrorsFiltersProps) {
  const [open, setOpen] = useState(false);
  const serverFilters = value.errorOrigin === "MOP_SERVER";

  const draft = (next: ErrorsFilterState) => onChange(withoutServerFilters(next));
  const search = (next: ErrorsFilterState) => {
    const cleaned = withoutServerFilters(next);
    onChange(cleaned);
    onApply(cleaned);
  };
  const applyRange = (from?: string, to?: string) => {
    search({ ...value, from, to });
  };

  return (
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
          from={value.from}
          to={value.to}
          onChange={(from, to) => applyRange(from, to)}
        />
        <Button
          variant="outlined"
          disableElevation
          startIcon={<FilterAltIcon sx={{ fontSize: 18 }} />}
          onClick={() => setOpen((current) => !current)}
          aria-expanded={open}
          sx={{
            ...PERIOD_BUTTON_SX(open),
            "& .MuiButton-startIcon": { color: "#2f6b12", marginRight: "6px" },
          }}
        >
          Filtros
        </Button>
      </Box>
      {open && (
      <>
      <Box sx={fieldGridSx}>
        <TextField
          size="small"
          label="Organização (orgId)"
          placeholder="UUID da organização"
          value={value.orgId || ""}
          onChange={(e) =>
            draft({ ...value, orgId: e.target.value || undefined })
          }
          onKeyDown={(e) => {
            if (e.key === "Enter") search(value);
          }}
          sx={{ bgcolor: "#fff" }}
        />
        <FilterSelect
          label="Origem"
          field="errorOrigin"
          options={ERROR_ORIGIN_OPTIONS}
          value={value}
          onChange={(next) => {
            const allowed = errorCodesForOrigin(next.errorOrigin);
            const stillValid = allowed.some((opt) => opt.value === next.errorCode);
            draft(stillValid ? next : { ...next, errorCode: undefined });
          }}
        />
        <FilterSelect
          label="Código do erro"
          field="errorCode"
          options={errorCodesForOrigin(value.errorOrigin)}
          value={value}
          onChange={draft}
          disabled={!value.errorOrigin || errorCodesForOrigin(value.errorOrigin).length === 0}
        />
        <FilterSelect
          label="Severidade"
          field="severity"
          options={SEVERITY_OPTIONS}
          value={value}
          onChange={draft}
        />
        <FilterSelect
          label="Criticidade"
          field="criticality"
          options={CRITICALITY_OPTIONS}
          value={value}
          onChange={draft}
        />
        {serverFilters && (
          <>
            <FilterSelect
              label="Tipo de erro"
              field="errorType"
              options={ERROR_TYPE_OPTIONS}
              value={value}
              onChange={draft}
            />
            <FilterSelect
              label="Microserviço"
              field="service"
              options={SERVICE_OPTIONS}
              value={value}
              onChange={draft}
            />
            <FilterSelect
              label="Domínio"
              field="domain"
              options={DOMAIN_OPTIONS}
              value={value}
              onChange={draft}
            />
            <FilterSelect
              label="Escopo"
              field="scope"
              options={SCOPE_OPTIONS}
              value={value}
              onChange={(next) =>
                draft(
                  next.scope === "PCM_INTEGRATION"
                    ? next
                    : { ...next, pcmIntegration: undefined },
                )
              }
            />
            {value.scope === "PCM_INTEGRATION" && (
              <FilterSelect
                label="Integração PCM"
                field="pcmIntegration"
                options={PCM_INTEGRATION_OPTIONS}
                value={value}
                onChange={draft}
              />
            )}
            <FilterSelect
              label="Visibilidade no Client"
              field="mopClientVisible"
              options={MOP_CLIENT_VISIBLE_OPTIONS}
              value={value}
              onChange={draft}
            />
          </>
        )}
      </Box>
      </>
      )}
      {open && (
      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1, mt: 1.5 }}>
          <Button
            variant="outlined"
            disableElevation
            onClick={() => search(value)}
            sx={PERIOD_BUTTON_SX(true)}
          >
            Filtrar
          </Button>
        <Button
          onClick={onClear}
          sx={{
            textTransform: "uppercase",
            fontWeight: 500,
            fontSize: 12,
            letterSpacing: 0.4,
            color: "#1a1a1a",
            minWidth: 0,
            px: 0.5,
            "&:hover": { bgcolor: "transparent", color: "#000" },
          }}
          startIcon={<DeleteIcon sx={{ fontSize: 16 }} />}
        >
          Limpar filtros
        </Button>
      </Box>
      )}
    </Box>
  );
}
