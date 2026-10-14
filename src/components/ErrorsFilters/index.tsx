import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import type { ListErrorsParams } from "@/src/types/errors";
import {
  CRITICALITY_OPTIONS,
  DOMAIN_OPTIONS,
  ERROR_TYPE_OPTIONS,
  FilterOption,
  MOP_CLIENT_VISIBLE_OPTIONS,
  PCM_INTEGRATION_OPTIONS,
  SCOPE_OPTIONS,
  SERVICE_OPTIONS,
  SEVERITY_OPTIONS,
} from "@/src/utils/errorLabels";

export type ErrorsFilterState = Omit<ListErrorsParams, "page" | "limit">;

interface ErrorsFiltersProps {
  value: ErrorsFilterState;
  onChange: (next: ErrorsFilterState) => void;
  onApply: () => void;
  onClear: () => void;
}

const selectSx = { minWidth: 200, bgcolor: "#fff" };

function FilterSelect({
  label,
  field,
  options,
  value,
  onChange,
}: {
  label: string;
  field: keyof ErrorsFilterState;
  options: FilterOption[];
  value: ErrorsFilterState;
  onChange: (next: ErrorsFilterState) => void;
}) {
  return (
    <FormControl size="small" sx={selectSx}>
      <InputLabel>{label}</InputLabel>
      <Select
        label={label}
        value={value[field] || ""}
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
  return (
    <Box
      sx={{
        mb: 2,
        p: 2,
        bgcolor: "#fff",
        border: "2px solid #e6e6e6",
        borderRadius: "4px",
      }}
    >
      <Typography
        variant="subtitle2"
        sx={{ color: "#193F12", fontWeight: 600, mb: 1.5 }}
      >
        Filtros
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 1.5,
          alignItems: "center",
        }}
      >
        <TextField
          size="small"
          label="Organização (orgId)"
          placeholder="UUID da organização"
          value={value.orgId || ""}
          onChange={(e) =>
            onChange({ ...value, orgId: e.target.value || undefined })
          }
          sx={{ minWidth: 240, bgcolor: "#fff" }}
        />
        <TextField
          size="small"
          label="Código do erro"
          placeholder="Ex.: EP_JWS_SIGNATURE_INVALID"
          value={value.errorCode || ""}
          onChange={(e) =>
            onChange({ ...value, errorCode: e.target.value || undefined })
          }
          sx={{ minWidth: 260, bgcolor: "#fff" }}
        />
        <FilterSelect
          label="Severidade"
          field="severity"
          options={SEVERITY_OPTIONS}
          value={value}
          onChange={onChange}
        />
        <FilterSelect
          label="Criticidade"
          field="criticality"
          options={CRITICALITY_OPTIONS}
          value={value}
          onChange={onChange}
        />
        <FilterSelect
          label="Tipo de erro"
          field="errorType"
          options={ERROR_TYPE_OPTIONS}
          value={value}
          onChange={onChange}
        />
        <FilterSelect
          label="Microserviço"
          field="service"
          options={SERVICE_OPTIONS}
          value={value}
          onChange={onChange}
        />
        <FilterSelect
          label="Domínio"
          field="domain"
          options={DOMAIN_OPTIONS}
          value={value}
          onChange={onChange}
        />
        <FilterSelect
          label="Escopo"
          field="scope"
          options={SCOPE_OPTIONS}
          value={value}
          onChange={onChange}
        />
        <FilterSelect
          label="Integração PCM"
          field="pcmIntegration"
          options={PCM_INTEGRATION_OPTIONS}
          value={value}
          onChange={onChange}
        />
        <FilterSelect
          label="Visibilidade no Client"
          field="mopClientVisible"
          options={MOP_CLIENT_VISIBLE_OPTIONS}
          value={value}
          onChange={onChange}
        />
        <TextField
          size="small"
          label="De"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={value.from || ""}
          onChange={(e) =>
            onChange({ ...value, from: e.target.value || undefined })
          }
          sx={{ minWidth: 160, bgcolor: "#fff" }}
        />
        <TextField
          size="small"
          label="Até"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={value.to || ""}
          onChange={(e) =>
            onChange({ ...value, to: e.target.value || undefined })
          }
          sx={{ minWidth: 160, bgcolor: "#fff" }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={onApply}
          sx={{ textTransform: "none", fontWeight: 600 }}
        >
          Filtrar
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          onClick={onClear}
          sx={{ textTransform: "none" }}
        >
          Limpar
        </Button>
      </Box>
    </Box>
  );
}
