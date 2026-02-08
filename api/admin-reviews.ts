import { createClient } from '@supabase/supabase-js';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export default async function handler(req: any, res: any) {
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const authHeader = req.headers['authorization'] || '';
    if (!authHeader.startsWith('Bearer ')) return res.status(401).json({ error: 'Unauthorized' });

    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    if (req.method === 'GET') {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) return res.status(500).json({ error: 'Failed to fetch reviews' });

      return res.status(200).json({ reviews: data });
    }

    if (req.method === 'POST') {
      const { id, action } = req.body;
      if (!id || !action) return res.status(400).json({ error: 'ID and action required' });

      if (action === 'approve') {
        const { error } = await supabase.from('reviews').update({ status: 'approved' }).eq('id', id);
        if (error) return res.status(500).json({ error: 'Failed to approve review' });
      } else if (action === 'delete') {
        const { error } = await supabase.from('reviews').delete().eq('id', id);
        if (error) return res.status(500).json({ error: 'Failed to delete review' });
      } else {
        return res.status(400).json({ error: 'Invalid action' });
      }

      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}