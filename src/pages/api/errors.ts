import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ message: "Method not allowed" });
  }

  const baseUrl = (
    process.env.MOP_ERRORS_API_URL || "http://localhost:3010"
  ).replace(/\/$/, "");
  const apiKey = process.env.MOP_ERRORS_API_KEY || "";

  try {
    const headers: Record<string, string> = {};
    if (apiKey) {
      headers["X-MOP-API-Key"] = apiKey;
    }

    const { data } = await axios.get(`${baseUrl}/errors`, {
      params: req.query,
      headers,
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
      message: "Failed to fetch errors from mop-server-errors",
      detail: ax.response?.data ?? ax.message,
    });
  }
}
