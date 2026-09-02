import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const env = fs.readFileSync('.env', 'utf-8');
const lines = env.split('\n');
const urlLine = lines.find(l => l.startsWith('VITE_SUPABASE_URL='));
const keyLine = lines.find(l => l.startsWith('VITE_SUPABASE_ANON_KEY='));

const url = urlLine.substring(urlLine.indexOf('=') + 1).replace(/"/g, '').trim();
const key = keyLine.substring(keyLine.indexOf('=') + 1).replace(/"/g, '').trim();

const supabase = createClient(url, key);

async function run() {
  console.log('Counting products...');
  const { count } = await supabase.from('products').select('*', { count: 'exact', head: true });
  console.log('Total products:', count);

  const keep = ['brown women red cotton', 'testin', 'BROWN WOMEN PURE COTTON SAREE 11'];
  
  console.log('Deleting mock products using fast SQL filter...');
  const { data, error } = await supabase.from('products').delete().not('name', 'in', '("brown women red cotton","testin","BROWN WOMEN PURE COTTON SAREE 11")');
  
  if (error) {
    console.error('Delete error:', error);
  } else {
    console.log('Delete successful.');
  }

  const { data: remaining } = await supabase.from('products').select('name');
  console.log('Remaining products:', remaining.length);
  console.log(remaining.map(r => r.name));
}
run();
