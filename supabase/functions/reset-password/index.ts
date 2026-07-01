import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

interface ResetPasswordRequest {
  email: string;
  code: string;
  newPassword: string;
}

export const handler = async (req: Request): Promise<Response> => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405 });
  }

  try {
    const body: ResetPasswordRequest = await req.json();
    const { email, code, newPassword } = body;

    if (!email || !code || !newPassword) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400 },
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseServiceKey) {
      return new Response(
        JSON.stringify({ error: "Supabase configuration missing" }),
        { status: 500 },
      );
    }

    const client = createClient(supabaseUrl, supabaseServiceKey);

    // Get the user by email
    const { data: users, error: getUserError } = await client.auth.admin.listUsers();

    if (getUserError || !users) {
      return new Response(
        JSON.stringify({ error: "Failed to retrieve user" }),
        { status: 500 },
      );
    }

    const user = users.users.find((u) => u.email?.toLowerCase() === email.toLowerCase());

    if (!user) {
      return new Response(
        JSON.stringify({ error: "User not found" }),
        { status: 404 },
      );
    }

    // Update user password
    const { error: updateError } = await client.auth.admin.updateUserById(user.id, {
      password: newPassword,
    });

    if (updateError) {
      return new Response(
        JSON.stringify({ error: updateError.message || "Failed to update password" }),
        { status: 400 },
      );
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Internal server error" }),
      { status: 500 },
    );
  }
};

Deno.serve(handler);
