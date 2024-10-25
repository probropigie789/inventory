// // Next.js API route support: https://nextjs.org/docs/api-routes/introduction
// import createClient from "@/Database/apiClient";
// import type { NextApiRequest, NextApiResponse } from "next";

// type Data = {
//   error: any;
//   data: any;
// };

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse<Data>
// ) {
//   // only allow POST requests
//   if (req.method !== "GET") {
//     return res.status(405).json({
//       error: `Method ${req.method} Not Allowed`,
//       data: null,
//     });
//   }

//   let supabase = createClient(req, res);
//   let {
//     data: { user },
//   } = await supabase.auth.getUser();

//   if (!user) {
//     return res.status(401).json({
//       error: "Unauthorized",
//       data: null,
//     });
//   }

//   const metadata = user.user_metadata;

//   const { data } = await supabase.auth.updateUser({
//     data: {
//       ...metadata,
//       isAdmin: true,
//     },
//   });

//   console.log(data);

//   return res.status(200).json({
//     data: "Admin created!",
//     error: null,
//   });
// }
