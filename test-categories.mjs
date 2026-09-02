
import { createClient } from "@supabase/supabase-js";
const supabase = createClient("https://pjjiwghqfonoirxtpkgd.supabase.co", "sb_publishable_cfp0bMan8m7a113w3U6uQw_p1nZco9n");
async function run() {
  const { data } = await supabase.from("categories").select("name");
  console.log("Categories:", data);
}
run();

