import createClient from "@/Database/apiClient";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        // Query the 'Cars' table for deleted cars
        let supabase = createClient(req, res);
        const { data: deletedCars, error } = await supabase
            .from('Cars')
            .select('*')
            .eq('is_deleted', true);

        // Handle any errors from the database query
        if (error) {
            return res.status(500).json({ error: 'Error retrieving deleted cars', details: error.message });
        }

        // Respond with the list of deleted cars
        return res.status(200).json({ data: deletedCars });
        console.log(deletedCars);
    } catch (err) {
        console.error('Unexpected error in get-deleted-cars:', err);
        return res.status(500).json({ error: 'Unexpected error' });
    }
}
