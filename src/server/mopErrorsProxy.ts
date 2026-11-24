import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export async function proxyErrors(
  req: NextApiRequest,
  res: NextApiResponse,
  path: string,
) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ message: "Method not allowed" });
  }

  const baseUrl = (
    process.env.MOP_ENTRYPOINT_URL || "http://localhost:3000"
  ).replace(/\/$/, "");

  try {
    const { data } = await axios.get(`${baseUrl}${path}`, {
      params: req.query,
      timeout: 15000,
    });

    return res.status(200).json(data);
  } catch (error: unknown) {
    const ax = error as {
      response?: { status?: number; data?: unknown };
      message?: string;
    };
    const status = ax.response?.status || 502;
    return res.status(status).json({
      message: "Falha ao consultar erros no entrypoint",
      detail: ax.response?.data ?? ax.message,
    });
  }
}
