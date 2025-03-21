import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://gzhzxvquzzajurhdmdrd.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd6aHp4dnF1enphanVyaGRtZHJkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI0NDk2NDMsImV4cCI6MjA1ODAyNTY0M30.P7BIHCAjtIMKQQ8mCNH1YQQaU13mFpGeEmMNkO9OFDw";

export const supabase = createClient(supabaseUrl, supabaseKey);
