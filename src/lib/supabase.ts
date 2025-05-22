
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://your-project-url.supabase.co';
// Note: You should replace this with your actual Supabase URL and anon key
// after connecting to Supabase through Lovable's integration
const supabaseAnonKey = 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
