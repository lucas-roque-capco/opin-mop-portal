import axios from "axios";
import type { ListErrorsParams, ListErrorsResponse } from "@/src/types/errors";

export async function fetchErrors(
  params: ListErrorsParams,
): Promise<ListErrorsResponse> {
  const { data } = await axios.get<ListErrorsResponse>("/api/errors", {
    params,
  });
  return data;
}
