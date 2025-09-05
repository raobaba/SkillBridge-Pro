// src/utils/supabase.js
const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_PRIVATE_ROLE_KEY; // 🔑 use service key on backend

const supabase = createClient(supabaseUrl, supabaseServiceKey);

module.exports = { supabase };

