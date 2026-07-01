Deno.serve(async (req: Request) => {
  try {
    const body = await req.json();
    const message = body?.message || "no message";
    const key = Deno.env.get("GEMINI_API_KEY");
    
    if (!key) {
      return new Response(
        JSON.stringify({ error: "No API key", reply: null }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    const response = await fetch("https://generativelanguage.googleapis.com/v1beta/interactions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": key,
      },
      body: JSON.stringify({
        model: "gemini-2.5-flash",
        input: message,
      }),
    });

    const data = await response.json();
    
    // If Google API returned an error, return the error details
    if (!response.ok) {
      return new Response(
        JSON.stringify({ 
          ok: false, 
          status: response.status, 
          reply: null,
          error: data 
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    // Parse successful response from Google API
    let reply = "No response text found";
    if (data?.steps && Array.isArray(data.steps)) {
      for (const step of data.steps) {
        if (step?.content && Array.isArray(step.content)) {
          for (const item of step.content) {
            if (item?.type === "text" && item?.text) {
              reply = item.text;
              break;
            }
          }
          if (reply !== "No response text found") break;
        }
      }
    }

    return new Response(
      JSON.stringify({ ok: true, status: 200, reply: reply.trim() }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ ok: false, status: 500, error: error?.message || "Unknown error" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  }
});
