import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const env = fs.readFileSync('.env', 'utf-8');
const lines = env.split('\n');
const url = lines.find(l => l.startsWith('VITE_SUPABASE_URL=')).split('=')[1].replace(/"/g, '').trim();
const key = lines.find(l => l.startsWith('VITE_SUPABASE_ANON_KEY=')).split('=')[1].replace(/"/g, '').trim();

const supabase = createClient(url, key);

async function run() {
  const keep = ['brown women red cotton', 'testin', 'BROWN WOMEN PURE COTTON SAREE 11'];
  
  let deletedCount = 0;
  while (true) {
    const { data: page } = await supabase.from('products').select('id, name').limit(1000);
    const toDeleteIds = page.filter(p => !keep.includes(p.name)).map(p => p.id);
    
    if (toDeleteIds.length === 0) break;
    
    console.log(`Found ${toDeleteIds.length} items to delete on this page...`);
    
    for (let i = 0; i < toDeleteIds.length; i += 100) {
      const chunk = toDeleteIds.slice(i, i + 100);
      const { error } = await supabase.from('products').delete().in('id', chunk);
      if (error) {
        console.error('Delete error', error);
      }
      deletedCount += chunk.length;
    }
    console.log(`Deleted ${deletedCount} total...`);
  }
  
  const { count } = await supabase.from('products').select('*', { count: 'exact', head: true });
  console.log('Final product count in DB:', count);
}
run();
