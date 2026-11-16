import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ message: "Method not allowed" });
  }

  const body = req.body;
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return res.status(400).json({ message: "O corpo precisa ser um objeto JSON." });
  }

  const baseUrl = (process.env.MOP_ENTRYPOINT_URL || "http://localhost:3000").replace(/\/$/, "");

  try {
    const signed = await axios.post<{ token: string }>(`${baseUrl}/sign`, body, {
      timeout: 15000,
    });
    const token = signed.data?.token;
    if (!token) {
      return res.status(502).json({ message: "O entrypoint não devolveu um token assinado." });
    }

    const processed = await axios.post(`${baseUrl}/process`, token, {
      headers: { "Content-Type": "application/jwt" },
      timeout: 20000,
    });
    return res.status(200).json({
      message: "Chamada reenviada ao MOP.",
      result: processed.data,
    });
  } catch (error: unknown) {
    const ax = error as {
      response?: { status?: number; data?: { message?: string } | string };
      message?: string;
    };
    const detail =
      typeof ax.response?.data === "string"
        ? ax.response.data
        : ax.response?.data?.message || ax.message || "Falha ao reenviar";
    return res.status(ax.response?.status || 502).json({
      message: "Não foi possível reenviar a chamada.",
      detail,
    });
  }
}
