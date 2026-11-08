import { createClient } from "@supabase/supabase-js";

console.log(process.env.SUPABASE_URL!);
console.log(process.env.SUPABASE_SERVICE_KEY!)

export const supabaseClient = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!
);

