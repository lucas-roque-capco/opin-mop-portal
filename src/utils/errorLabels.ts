export type FilterOption = { value: string; label: string };

export const SEVERITY_OPTIONS: FilterOption[] = [
  { value: "ERROR", label: "Erro" },
  { value: "WARNING", label: "Alerta" },
];

export const CRITICALITY_OPTIONS: FilterOption[] = [
  { value: "LOW", label: "Baixa" },
  { value: "MEDIUM", label: "Média" },
  { value: "HIGH", label: "Alta" },
  { value: "CRITICAL", label: "Crítica" },
];

export const ERROR_TYPE_OPTIONS: FilterOption[] = [
  { value: "AUTH_JWS", label: "Autenticação JWS" },
  { value: "VALIDATION", label: "Validação de dados" },
  { value: "PCM_INTEGRATION", label: "Integração PCM" },
  { value: "INFRA", label: "Infraestrutura" },
  { value: "STORAGE", label: "Armazenamento (Blob)" },
  { value: "CACHE", label: "Cache (Redis)" },
  { value: "INTERNAL_MOP", label: "Interno do MOP" },
  { value: "BOOTSTRAP", label: "Inicialização do serviço" },
];

export const SERVICE_OPTIONS: FilterOption[] = [
  { value: "entrypoint-data", label: "Entrypoint (HTTP / JWS)" },
  { value: "data-service", label: "Data service (persistência)" },
  { value: "anonymizer", label: "Anonimizador" },
  { value: "errors-service", label: "Serviço de erros" },
];

export const DOMAIN_OPTIONS: FilterOption[] = [
  { value: "PROCESS", label: "Processamento (/process)" },
  { value: "METRICS", label: "Métricas / Funil (/metrics)" },
  { value: "SIGN", label: "Assinatura JWS (/sign)" },
  { value: "ANONYMIZATION", label: "Anonimização" },
  { value: "STORAGE_PIPELINE", label: "Pipeline de armazenamento" },
  { value: "BOOTSTRAP", label: "Subida do processo" },
  { value: "HEALTH", label: "Health check" },
  { value: "REPROCESS", label: "Reprocessamento" },
];

export const SCOPE_OPTIONS: FilterOption[] = [
  { value: "INTERNAL_MOP", label: "Interno do MOP" },
  { value: "PCM_INTEGRATION", label: "Integração com a PCM" },
  { value: "INFRA_EXTERNAL", label: "Infraestrutura externa" },
];

export const PCM_INTEGRATION_OPTIONS: FilterOption[] = [
  { value: "CONSENTIMENTO_UNICO", label: "Consentimento Único" },
  { value: "FUNIL_CONSENTIMENTO", label: "Funil de Consentimento" },
  { value: "APIS_TRANSACIONAIS", label: "APIs Transacionais" },
];

export const MOP_CLIENT_VISIBLE_OPTIONS: FilterOption[] = [
  { value: "true", label: "Visível ao MOP Client" },
  { value: "false", label: "Somente interno (não visto pelo Client)" },
];

export const PCM_ACTION_OPTIONS: FilterOption[] = [
  { value: "PUBLISH_SKIPPED", label: "Publicação ignorada" },
  { value: "PUBLISH_FAILED", label: "Falha na publicação" },
  { value: "ELIGIBILITY_SKIP", label: "Não elegível (skip)" },
];

/** Títulos amigáveis por errorCode (valor técnico continua no tooltip / detalhe). */
export const ERROR_CODE_LABELS: Record<string, string> = {
  EP_BOOTSTRAP_FAILED: "Falha ao iniciar o entrypoint",
  EP_VALIDATION_PIPE_FAILED: "Validação do payload rejeitada",
  EP_JWS_EMPTY_TOKEN: "Token JWS ausente",
  EP_JWS_ARRAY_PAYLOAD: "Payload JWS em formato inválido (array)",
  EP_JWS_UNSUPPORTED_MEDIA_TYPE: "Content-Type inválido (não é JWT)",
  EP_JWS_MISSING_ORG_ID: "Organização ausente no token",
  EP_JWS_KEY_NOT_FOUND: "Chave JWKS não encontrada para o kid",
  EP_JWS_JWKS_FETCH_FAILED: "Falha ao buscar chaves no Diretório",
  EP_JWS_SIGNATURE_INVALID: "Assinatura JWS inválida ou expirada",
  EP_SIGN_MISSING_CONFIG: "Configuração de assinatura incompleta",
  EP_SIGN_FAILED: "Falha ao gerar token JWS",
  EP_PROCESS_MISSING_SERVER_AS_ID: "serverASId obrigatório ausente",
  EP_PROCESS_MISSING_STATUS_CODE: "statusCode obrigatório na response",
  EP_PROCESS_RABBITMQ_EMIT_FAILED: "Falha ao enviar para o data-service",
  EP_PCM_CONSENTIMENTO_UNICO_QUEUE_NOT_CONFIGURED:
    "Fila Consentimento Único não configurada",
  EP_PCM_CONSENTIMENTO_UNICO_PUBLISH_FAILED:
    "Falha ao publicar Consentimento Único",
  EP_PCM_APIS_TRANSACIONAIS_QUEUE_NOT_CONFIGURED:
    "Fila APIs Transacionais não configurada",
  EP_PCM_APIS_TRANSACIONAIS_PUBLISH_FAILED:
    "Falha ao publicar APIs Transacionais",
  EP_METRICS_MISSING_SIGNING_KID: "signingKid ausente no /metrics",
  EP_PCM_FUNIL_QUEUE_NOT_CONFIGURED: "Fila Funil de Consentimento não configurada",
  EP_PCM_FUNIL_PUBLISH_FAILED: "Falha ao publicar Funil de Consentimento",
  EP_ANON_TCP_FAILED: "Falha de comunicação com o anonimizador",
  EP_ANON_SYNC_FAILED: "Falha ao sincronizar regras de anonimização",
  EP_ANON_UPLOAD_FAILED: "Falha ao enviar regras de anonimização",
  EP_SERVICE_BUS_CONNECTION_MISSING: "Connection string do Service Bus ausente",
  EP_REPROCESS_STORAGE_CONFIG_MISSING:
    "Storage não configurado no reprocessamento",
  EP_REPROCESS_BLOB_FAILED: "Falha ao reprocessar arquivo no Blob",
  DATA_BOOTSTRAP_FAILED: "Falha ao iniciar o data-service",
  DATA_VALIDATION_PIPE_FAILED: "Validação da mensagem no consumer",
  DATA_PROCESS_FAILED: "Erro interno ao processar a mensagem",
  DATA_STORAGE_ACCOUNT_MISSING: "Conta Azure Storage não configurada",
  DATA_STORAGE_CONTAINER_MISSING: "Container de dados não configurado",
  DATA_STORAGE_INVALID_PATH: "Path inválido (salvo em invalid-path)",
  DATA_STORAGE_UPLOAD_TIMEOUT: "Timeout no upload para o Blob",
  DATA_STORAGE_AUTH_FAILED: "Falha de autenticação no Azure Blob",
  DATA_STORAGE_FORBIDDEN: "Acesso negado ao Azure Blob (403)",
  DATA_STORAGE_NOT_FOUND: "Container/conta Blob não encontrados (404)",
  DATA_STORAGE_UPLOAD_FAILED: "Falha no upload para o Azure Blob",
  DATA_NACK_FAILED: "Falha ao confirmar rejeição na fila (NACK)",
  ANON_BOOTSTRAP_FAILED: "Falha ao iniciar o anonimizador",
  ANON_VALIDATION_GET_FIELDS: "Parâmetros inválidos ao buscar campos",
  ANON_VALIDATION_UPLOAD_RULES: "Parâmetros inválidos ao enviar regras",
  ANON_REDIS_UNAVAILABLE: "Redis indisponível (usando fallback)",
  ANON_REDIS_TIMEOUT: "Timeout na conexão com o Redis",
  ANON_REDIS_GET_FAILED: "Falha ao ler regras no Redis",
  ANON_REDIS_SAVE_FAILED: "Falha ao gravar regras no Redis",
  ANON_AZURE_LOAD_FAILED: "Falha ao carregar regras do Azure",
  ANON_AZURE_BLOB_MISSING: "Arquivo de regras não encontrado no Azure",
  ANON_AZURE_RULES_INVALID: "Regras do Azure com formato inválido",
  ANON_AZURE_UPLOAD_FAILED: "Falha ao enviar regras para o Azure",
  ANON_AZURE_ACCOUNT_MISSING: "Conta Storage ausente no anonimizador",
  ANON_SYNC_FAILED: "Falha na sincronização de regras",
  ANON_FALLBACK_FILE_MISSING: "Arquivo local de regras ausente",
  ANON_STREAM_UNDEFINED: "Falha ao ler stream do Blob",
};

const labelMaps: Record<string, FilterOption[]> = {
  severity: SEVERITY_OPTIONS,
  criticality: CRITICALITY_OPTIONS,
  errorType: ERROR_TYPE_OPTIONS,
  service: SERVICE_OPTIONS,
  domain: DOMAIN_OPTIONS,
  scope: SCOPE_OPTIONS,
  pcmIntegration: PCM_INTEGRATION_OPTIONS,
  pcmAction: PCM_ACTION_OPTIONS,
  mopClientVisible: MOP_CLIENT_VISIBLE_OPTIONS,
};

/** Converte valor da API para rótulo amigável (tabela/chips). */
export function labelFor(field: string, value: string | null | undefined): string {
  if (value == null || value === "") return "—";
  const opt = labelMaps[field]?.find((o) => o.value === value);
  return opt?.label ?? value;
}

export function labelForErrorCode(code: string | null | undefined): string {
  if (!code) return "—";
  return ERROR_CODE_LABELS[code] ?? code;
}

