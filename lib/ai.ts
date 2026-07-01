import supabase from "@/lib/supabase";

export type ChatMessage = {
  role: "user" | "assistant";
  text: string;
};

export async function sendChatMessage(message: string, history: ChatMessage[]) {
  try {
    // Call Supabase Edge Function (which has the API key on the server)
    const { data, error } = await supabase.functions.invoke("ai-chatbot", {
      body: { message, history },
    });

    console.log("🔍 AI Response received:", { data, error });

    if (error) {
      console.log("❌ Supabase error:", error);
      throw new Error(error.message || "Edge Function error");
    }

    // Check if function returned an error in the data
    if (!data?.ok) {
      console.log("⚠️  Edge Function error status:", data?.status);
      if (data?.error) {
        console.log("📋 Google API Error Details:", JSON.stringify(data.error, null, 2));
      }
      throw new Error(`Chat request failed with status ${data?.status}: ${JSON.stringify(data?.error)}`);
    }

    const reply = data?.reply;
    if (!reply) {
      throw new Error("No response from chatbot");
    }

    console.log("✅ Chat success, reply length:", reply.length);
    return reply;
  } catch (err: any) {
    console.warn("AI chat request failed:", err.message ?? err);
    throw err;
  }
}
