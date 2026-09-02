import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const env = fs.readFileSync('.env', 'utf-8').replace(/\r/g, '');
const url = env.split('\n').find(l => l.startsWith('VITE_SUPABASE_URL=')).replace('VITE_SUPABASE_URL=', '').trim();
const key = env.split('\n').find(l => l.startsWith('VITE_SUPABASE_ANON_KEY=')).replace('VITE_SUPABASE_ANON_KEY=', '').trim();
const supabase = createClient(url, key);

async function run() {
  const { data, error } = await supabase.from('products').delete().not('name', 'in', '("brown women red cotton","testin","BROWN WOMEN PURE COTTON SAREE 11")');
  console.log('Delete error:', error);
  const { data: remaining } = await supabase.from('products').select('name');
  console.log('Remaining:', remaining.length);
  console.log(remaining);
}
run();
