
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';

const supabaseUrl = 'https://wfouryczkuzjmotkvpvy.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indmb3VyeWN6a3V6am1vdGt2cHZ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc4Njg3MDgsImV4cCI6MjA2MzQ0NDcwOH0.H8ZIWyuX0gY-r_TzaqVipNm9skytzqvRE56ODND9tb0';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
