// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import createClient from "@/Database/apiClient";
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  error: any;
  data: any;
};

const PAGE_SIZE = 2;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
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
  let { pageNumber, text } = req.body;

  // validate the body
  if (!pageNumber) {
    return res.status(400).json({
      error: `Missing required fields: ${pageNumber ? "" : "pageNumber"}`,
      data: null,
    });
  }

  pageNumber = parseInt(pageNumber);

  const supabase = createClient(req, res);

  let countQuery = supabase
    .from("Cars")
    .select("id", { count: "exact", head: true })
    .eq("is_deleted", true);

  if (text !== "") {
    countQuery = countQuery.or(
      `VIN.ilike.%${text}%,LicensePlate.ilike.%${text}%`
    );
  }
  // see how many entries are in the database Cars table
  const { count } = await countQuery;

  const numberOfPages = Math.ceil((count as any) / PAGE_SIZE);
  const start = (pageNumber - 1) * PAGE_SIZE;
  const end = start + PAGE_SIZE - 1;
  let query = supabase
    .from("Cars")
    .select("*")
    .range(start, end)
    .eq("is_deleted", true);

  if (text !== "") {
    query = query.or(`VIN.ilike.%${text}%,LicensePlate.ilike.%${text}%`);
  }
  // get the entries from the database
  const { data, error } = await query;

  if (error) {
    return res.status(500).json({
      error: error,
      data: null,
    });
  }

  return res.status(200).json({
    error: null,
    data: {
      totalCount: count,
      cars: data,
      maxPages: numberOfPages,
    },
  });
}
