import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const env = fs.readFileSync('.env', 'utf-8');
const lines = env.split('\n');
const url = lines.find(l => l.startsWith('VITE_SUPABASE_URL=')).split('=')[1].replace(/"/g, '').trim();
const key = lines.find(l => l.startsWith('VITE_SUPABASE_ANON_KEY=')).split('=')[1].replace(/"/g, '').trim();

const supabase = createClient(url, key);

async function run() {
  const keep = ['brown women red cotton', 'testin', 'BROWN WOMEN PURE COTTON SAREE 11'];
  
  // Get all names
  const { data: sample } = await supabase.from('products').select('name').limit(1000);
  const namesToDelete = [...new Set(sample.map(p => p.name))].filter(n => !keep.includes(n));
  
  console.log('Unique mock names to delete:', namesToDelete.length);
  
  for (const name of namesToDelete) {
    let deletedCount = 0;
    while (true) {
      const { data, error, count } = await supabase.from('products').delete({ count: 'exact' }).eq('name', name);
      if (error) {
        console.error('Error deleting', name, error);
        break;
      }
      if (count === 0 || count === null) break;
      deletedCount += count;
      console.log(`Deleted ${count} rows for ${name}`);
    }
  }
  
  const { count } = await supabase.from('products').select('*', { count: 'exact', head: true });
  console.log('Final product count in DB:', count);
}
run();
