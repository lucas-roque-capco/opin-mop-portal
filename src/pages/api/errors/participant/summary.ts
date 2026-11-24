import type { NextApiRequest, NextApiResponse } from "next";
import { proxyErrors } from "@/src/server/mopErrorsProxy";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  return proxyErrors(req, res, "/errors/participant/summary");
}