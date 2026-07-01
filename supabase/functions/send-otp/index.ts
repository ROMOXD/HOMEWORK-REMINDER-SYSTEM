interface SendOtpRequest {
  email: string;
  code: string;
}

export const handler = async (req: Request): Promise<Response> => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405 });
  }

  try {
    const body: SendOtpRequest = await req.json();
    const { email, code } = body;

    if (!email || !code) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400 },
      );
    }

    const resendApiKey = Deno.env.get("RESEND_API_KEY");

    if (!resendApiKey) {
      console.error("RESEND_API_KEY not configured");
      return new Response(
        JSON.stringify({ error: "Email service not configured. Please contact support." }),
        { status: 500 },
      );
    }

    // Send email using Resend
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: "onboarding@resend.dev",
        to: email,
        subject: "Password Reset Code - Homework Reminder System",
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <style>
                body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { text-align: center; margin-bottom: 30px; }
                .code-box { background: #f5f5f5; border: 1px solid #e0e0e0; border-radius: 8px; padding: 20px; text-align: center; margin: 30px 0; }
                .code { font-size: 48px; font-weight: bold; letter-spacing: 10px; color: #22c55e; font-family: monospace; }
                .footer { color: #666; font-size: 12px; text-align: center; margin-top: 30px; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>Password Reset Request</h1>
                </div>
                <p>We received a request to reset your password. Use the code below to complete the process.</p>
                <div class="code-box">
                  <p style="color: #999; margin: 0 0 10px 0; font-size: 14px;">Your verification code:</p>
                  <div class="code">${code}</div>
                </div>
                <p>This code will expire in 10 minutes. If you didn't request a password reset, please ignore this email.</p>
                <div class="footer">
                  <p>Homework Reminder System</p>
                </div>
              </div>
            </body>
          </html>
        `,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("Resend API error:", result);
      return new Response(
        JSON.stringify({ error: "Failed to send email" }),
        { status: 400 },
      );
    }

    return new Response(JSON.stringify({ success: true, id: result.id }), { status: 200 });
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Internal server error" }),
      { status: 500 },
    );
  }
};

Deno.serve(handler);
