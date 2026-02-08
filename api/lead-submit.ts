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

    const { name, email, phone, message } = req.body;

    if (!name || !email)
      return res.status(400).json({ error: 'Name and email are required' });

    const { data, error } = await supabase
      .from('leads')
      .insert([{ name, email, phone, message, status: 'new' }])
      .select()
      .single();

    if (error) return res.status(500).json({ error: 'Failed to submit lead' });

    return res.status(200).json({ success: true, id: data.id });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}