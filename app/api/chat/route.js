import { GoogleGenerativeAI } from "@google/generative-ai";
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { getPostHogClient } from "@/lib/posthog-server";
import { randomUUID } from "crypto";

export async function POST(request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { message, groupId, history } = await request.json();

  if (!message) {
    return NextResponse.json({ error: "Message is required" }, { status: 400 });
  }

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction:
        "You are a helpful AI study assistant inside a student study group platform called BingeStudy. Help students understand concepts, solve doubts, and explain topics clearly. Keep responses concise and easy to understand.",
    });

    // Build chat history for context
    const chat = model.startChat({
      history:
        history?.map((msg) => ({
          role: msg.role === "user" ? "user" : "model",
          parts: [{ text: msg.content }],
        })) || [],
    });

    const traceId = randomUUID();
    const startTime = Date.now();
    let result;
    try {
      result = await chat.sendMessage(message);
    } catch (llmError) {
      const posthog = getPostHogClient();
      posthog.capture({
        distinctId: user.id,
        event: "$ai_generation",
        properties: {
          $ai_trace_id: traceId,
          $ai_session_id: groupId,
          $ai_model: "gemini-2.5-flash",
          $ai_provider: "google",
          $ai_latency: (Date.now() - startTime) / 1000,
          $ai_is_error: true,
          $ai_error: llmError.message,
        },
      });
      return NextResponse.json({ error: llmError.message }, { status: 500 });
    }

    const reply = result.response.text();
    const usage = result.response.usageMetadata;

    const posthog = getPostHogClient();
    posthog.capture({
      distinctId: user.id,
      event: "$ai_generation",
      properties: {
        $ai_trace_id: traceId,
        $ai_session_id: groupId,
        $ai_model: "gemini-2.5-flash",
        $ai_provider: "google",
        $ai_input_tokens: usage?.promptTokenCount,
        $ai_output_tokens: usage?.candidatesTokenCount,
        $ai_latency: (Date.now() - startTime) / 1000,
      },
    });

    // Save user message to database
    await supabase.from("ai_chats").insert({
      group_id: groupId,
      user_id: user.id,
      role: "user",
      content: message,
    });

    // Save AI reply to database
    await supabase.from("ai_chats").insert({
      group_id: groupId,
      user_id: user.id,
      role: "assistant",
      content: reply,
    });

    return NextResponse.json({ reply });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Get chat history for a user in a group
export async function GET(request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const groupId = searchParams.get("groupId");

  const { data: history } = await supabase
    .from("ai_chats")
    .select("*")
    .eq("group_id", groupId)
    .eq("user_id", user.id)
    .order("created_at", { ascending: true });

  return NextResponse.json({ history: history || [] });
}
