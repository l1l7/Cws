import { createClient } from '@supabase/supabase-js';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export default async function handler(req: any, res: any) {
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { name, rating, review } = req.body;

    if (!name || !rating || !review)
      return res.status(400).json({ error: 'Name, rating, and review are required' });

    const ratingNum = parseInt(rating);
    if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5)
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });

    const { data, error } = await supabase
      .from('reviews')
      .insert([{ name, rating: ratingNum, review, status: 'pending' }])
      .select()
      .single();

    if (error) return res.status(500).json({ error: 'Failed to submit review' });

    return res.status(200).json({ success: true, id: data.id });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}