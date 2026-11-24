import axios from "axios";
import type { ListErrorsParams, ListErrorsResponse } from "@/src/types/errors";

export interface ParticipantErrorsParams {
  from?: string;
  to?: string;
  severity?: string;
  errorCode?: string;
  page?: number;
  limit?: number;
}

export interface ErrorCount {
  label: string;
  value: number;
}

export interface ParticipantSummary {
  filesWithValidation: number;
  errors: number;
  warnings: number;
  byMessage: ErrorCount[];
  byPath: ErrorCount[];
}

export async function fetchMopErrors(
  params: ListErrorsParams,
): Promise<ListErrorsResponse> {
  const { data } = await axios.get<ListErrorsResponse>("/api/errors/mop", {
    params,
  });
  return data;
}

export async function fetchParticipantErrors(
  params: ParticipantErrorsParams,
): Promise<ListErrorsResponse> {
  const { data } = await axios.get<ListErrorsResponse>("/api/errors/participant", {
    params,
  });
  return data;
}

export async function fetchParticipantSummary(params: {
  from?: string;
  to?: string;
}): Promise<ParticipantSummary> {
  const { data } = await axios.get<ParticipantSummary>(
    "/api/errors/participant/summary",
    { params },
  );
  return data;
}
