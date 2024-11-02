import createClient from "@/Database/apiClient";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        let supabase = createClient(req, res);
        const { data: deletedCars, error } = await supabase
            .from('Cars')
            .select('*')
            .eq('is_deleted', true);

        if (error) {
            return res.status(500).json({ error: 'Error retrieving deleted cars', details: error.message });
        }

        return res.status(200).json({ data: deletedCars });
        console.log(deletedCars);
    } catch (err) {
        console.error('Unexpected error in get-deleted-cars:', err);
        return res.status(500).json({ error: 'Unexpected error' });
    }
}
