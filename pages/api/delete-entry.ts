// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import createClient from "@/Database/apiClient";
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  error: any;
  data: any;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  // only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({
      error: `Method ${req.method} Not Allowed`,
      data: null,
    });
  }

  if (!req.body) {
    return res.status(400).json({
      error: "Missing request body",
      data: null,
    });
  }

  // get the body of the request
  let { id } = req.body;

  // validate the body
  if (!id) {
    return res.status(400).json({
      error: `Missing required fields: ${id ? "" : "id"}`,
      data: null,
    });
  }

  let supabase = createClient(req, res);
  const { data, error } = await supabase
    .from("Cars")
    .delete()
    .eq("id", id)
    .select("*");

  if (error) {
    return res.status(500).json({
      error: error,
      data: null,
    });
  }

  return res.status(200).json({
    error: null,
    data: data,
  });
}
