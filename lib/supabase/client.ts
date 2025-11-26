import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// DB가 초기화되기 전까지 타입 없이 사용
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
