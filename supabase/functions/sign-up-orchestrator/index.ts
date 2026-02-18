// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { email, password, fullName, organizationName, token } = await req.json();

    // 1. INPUT VALIDATION
    if (!email || !password || !fullName) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 2. SUPABASE AUTH CREATION (Point of No Return)
    // We create the user and auto-confirm them to skip email validation
    const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      user_metadata: { full_name: fullName },
      email_confirm: true,
    });

    if (authError) throw authError;

    const userId = authUser.user.id;

    // 3. ATOMIC DATABASE INTEGRATION (The Commit Step)
    let dbError;

    if (token) {
      // FLOW: INVITED MEMBER
      const { error } = await supabaseAdmin.rpc("handle_invited_user_registration", {
        p_user_id: userId,
        p_full_name: fullName,
        p_email: email,
        p_token: token // Your RPC should use the token to find the org_id
      });
      dbError = error;
    } else {
      // FLOW: NEW OWNER
      const { error } = await supabaseAdmin.rpc("handle_new_user_registration", {
        p_user_id: userId,
        p_full_name: fullName,
        p_email: email,
        p_organization_name: organizationName,
      });
      dbError = error;
    }

    // 4. THE ROLLBACK (If DB fails, erase the Auth user)
    if (dbError) {
      console.error("DB Error, rolling back Auth user:", dbError.message);
      await supabaseAdmin.auth.admin.deleteUser(userId);
      return new Response(JSON.stringify({ error: dbError.message }), {
        status: 409, // Usually a conflict or validation error
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 5. SUCCESS
    return new Response(JSON.stringify({ message: "Success", userId }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/signup' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
