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
  let { vin, licensePlate, year, maker, model, color } = req.body;

  // validate the body
  if (!vin || !licensePlate || !year || !maker || !model || !color) {
    return res.status(400).json({
      error: `Missing required fields: ${vin ? "" : "VIN, "} ${licensePlate ? "" : "License Plate, "} ${year ? "" : "Year, "} ${maker ? "" : "Maker, "} ${model ? "" : "Model, "} ${color ? "" : "Color"}`,
      data: null,
    });
  }

  // see if user is already in the database
  let supabase = createClient(req, res);
  const { data, error } = await supabase
    .from("Cars")
    .insert([
      {
        VIN: vin,
        LicensePlate: licensePlate,
        Year: year,
        Maker: maker,
        Model: model,
        Color: color,
      },
    ])
    .select("*")
    .single();

  if (error) {
    return res.status(500).json({
      error: error,
      data: null,
    });
  }

  const { data: originialCarData, error: originialCarDataError } =
    await supabase
      .from("Cars_Original")
      .insert([{ ...data }])
      .select("*")
      .single();

  console.log(originialCarData, originialCarDataError);

  return res.status(200).json({
    error: null,
    data: data,
  });
}
