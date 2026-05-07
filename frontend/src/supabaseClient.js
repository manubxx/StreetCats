import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://puelayozbqpbyeerypel.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB1ZWxheW96YnFwYnllZXJ5cGVsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY0MzMzMzksImV4cCI6MjA5MjAwOTMzOX0.SmFySwPCD4TQl8puB8-UuPEBMfbUa1ZF8-yWD3SP-fA'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)