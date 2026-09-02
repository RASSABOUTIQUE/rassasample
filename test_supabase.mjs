import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.join(__dirname, '.env');
const envFile = fs.readFileSync(envPath, 'utf8');

let envUrl = '';
let envKey = '';
envFile.split('\n').forEach(line => {
  if (line.startsWith('VITE_SUPABASE_URL=')) envUrl = line.split('=')[1].replace(/"/g, '').trim();
  if (line.startsWith('VITE_SUPABASE_ANON_KEY=')) envKey = line.split('=')[1].replace(/"/g, '').trim();
});

const supabaseUrl = envUrl;
const supabaseAnonKey = envKey;

console.log("==================================================");
console.log("RUNTIME VALUES");
console.log("URL:", supabaseUrl);
console.log("KEY:", supabaseAnonKey);
console.log("==================================================");

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing URL or KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function runTests() {
  console.log("==================================================");
  console.log("TEST 1: Database Access (Products)");
  try {
    const { data, error, status, statusText } = await supabase.from('products').select('*').limit(1);
    console.log("Status Code:", status);
    console.log("Status Text:", statusText);
    if (error) {
      console.error("Error:", error);
    } else {
      console.log("Success! Data:", data);
    }
  } catch (e) {
    console.error("Exception in DB fetch:", e.message);
    if (e.cause) console.error("Cause:", e.cause);
  }

  console.log("==================================================");
  console.log("TEST 2: Storage Access (List Buckets)");
  try {
    const { data, error } = await supabase.storage.listBuckets();
    if (error) {
      console.error("Error:", error);
    } else {
      console.log("Success! Buckets:", data.map(b => b.name));
    }
  } catch (e) {
    console.error("Exception in Storage fetch:", e.message);
  }
}

runTests();
