import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://csstahxmfifbozylwbrq.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."; // full key

export const supabase = createClient(supabaseUrl, supabaseAnonKey);