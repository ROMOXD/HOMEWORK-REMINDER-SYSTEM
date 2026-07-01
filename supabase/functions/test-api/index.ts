import { serve } from "https://deno.land/std@0.192.0/http/server.ts";

serve(async (req: Request) => {
  try {
    // Test 1: Check key
    const key = Deno.env.get("GEMINI_API_KEY");
    if (!key) {
      return new Response(JSON.stringify({ 
        test: "KEY",
        result: "FAILED",
        reason: "GEMINI_API_KEY not set"
      }), { 
        status: 500, 
        headers: { "Content-Type": "application/json" } 
      });
    }

    // Test 2: Try public endpoint
    console.log("Test: Fetching example.com");
    const exampleRes = await Promise.race([
      fetch("https://example.com", { method: "HEAD" }),
      new Promise((_, reject) => setTimeout(() => reject(new Error("timeout")), 3000))
    ]);
    console.log("Example.com response:", exampleRes.status);

    // Test 3: Try Gemini v1 endpoint
    console.log("Test: Calling Gemini v1");
    const v1Res = await Promise.race([
      fetch("https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=" + encodeURIComponent(key), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{
            role: "user",
            parts: [{ text: "hi" }]
          }],
          generationConfig: { maxOutputTokens: 5 },
        }),
      }),
      new Promise((_, reject) => setTimeout(() => reject(new Error("v1_timeout")), 3000))
    ]);
    
    const v1Data = await v1Res.json();
    console.log("V1 response:", v1Res.status, v1Data);

    return new Response(JSON.stringify({ 
      test: "ALL",
      result: "SUCCESS",
      gemini_status: v1Res.status,
      gemini_data: v1Data
    }), { 
      status: 200,
      headers: { "Content-Type": "application/json" } 
    });

  } catch (error) {
    const msg = (error as Error).message;
    console.error("Test error:", msg);
    return new Response(JSON.stringify({ 
      test: "ERROR",
      result: "FAILED",
      error: msg
    }), { 
      status: 500, 
      headers: { "Content-Type": "application/json" } 
    });
  }
});

