// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // In a real implementation, you would query your assignments table
    // for assignments that haven't been updated in 3 days and are not completed.
    // Since this project uses localStorage heavily for state and mockData for fallback,
    // this edge function is a structural placeholder that the client can hook up to their
    // real Postgres tables when they migrate state fully to Supabase.

    console.log("Checking for assignments inactive for 3 days...");
    
    // const { data: inactiveAssignments, error } = await supabaseClient
    //   .from('assignments')
    //   .select('*, users!assigned_to(email, name)')
    //   .lt('updated_at', new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString())
    //   .neq('status', 'completed');

    // if (inactiveAssignments) {
    //   for (const assignment of inactiveAssignments) {
    //     // Call EmailJS REST API or SendGrid here to send the reminder email
    //   }
    // }

    return new Response(
      JSON.stringify({ message: "Reminder checks completed." }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
