import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://csstahxmfifbozylwbrq.supabase.co' // Replace with your URL
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNzc3RhaHhtZmlmYm96eWx3YnJxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUxMzg4NzMsImV4cCI6MjA5MDcxNDg3M30.OLdHc5xCuZdasNVhZVnFuFF-jak3J-tGQnBlTrfgwYI' // Replace with your anon key

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
