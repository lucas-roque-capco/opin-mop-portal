export type MopErrorSeverity = "ERROR" | "WARNING";
export type MopErrorCriticality = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export type MopErrorType =
  | "AUTH_JWS"
  | "VALIDATION"
  | "PCM_INTEGRATION"
  | "INFRA"
  | "STORAGE"
  | "CACHE"
  | "INTERNAL_MOP"
  | "BOOTSTRAP";

export type MopErrorService =
  | "entrypoint-data"
  | "data-service"
  | "anonymizer"
  | "errors-service";

export type MopErrorDomain =
  | "PROCESS"
  | "METRICS"
  | "SIGN"
  | "ANONYMIZATION"
  | "STORAGE_PIPELINE"
  | "BOOTSTRAP"
  | "HEALTH"
  | "REPROCESS";

export type MopErrorScope = "INTERNAL_MOP" | "PCM_INTEGRATION" | "INFRA_EXTERNAL";

export type MopPcmIntegration =
  | "CONSENTIMENTO_UNICO"
  | "FUNIL_CONSENTIMENTO"
  | "APIS_TRANSACIONAIS";

export interface MopErrorRecord {
  id: string;
  timestamp: string;
  orgId: string | null;
  correlationId: string | null;
  traceId: string | null;
  severity: MopErrorSeverity;
  criticality: MopErrorCriticality;
  errorCode: string;
  errorType: MopErrorType;
  message: string;
  httpStatus: number | null;
  mopClientVisible: boolean;
  service: MopErrorService;
  component: string;
  domain: MopErrorDomain;
  scope: MopErrorScope;
  pcmIntegration: MopPcmIntegration | null;
  pcmAction: string | null;
  path: string | null;
  operation: string | null;
  httpType: string | null;
  origin: string | null;
  details: Record<string, unknown>;
  requestDto: Record<string, unknown> | null;
}

export interface ListErrorsResponse {
  data: MopErrorRecord[];
  total: number;
  page: number;
  limit: number;
}

export interface ListErrorsParams {
  orgId?: string;
  from?: string;
  to?: string;
  severity?: string;
  criticality?: string;
  errorType?: string;
  errorCode?: string;
  service?: string;
  domain?: string;
  scope?: string;
  pcmIntegration?: string;
  mopClientVisible?: string;
  page?: number;
  limit?: number;
}
