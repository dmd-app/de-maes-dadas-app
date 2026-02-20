import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ysyevqmpzrixfbezpams.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlzeWV2cW1wenJpeGZiZXpwYW1zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAxMzM3NTAsImV4cCI6MjA4NTcwOTc1MH0.SfPKida2v1puJCdyXXychpgRxV2IrADSVhesw8uRwtg';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
