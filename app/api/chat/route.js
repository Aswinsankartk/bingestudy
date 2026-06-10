import { GoogleGenerativeAI } from "@google/generative-ai";
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

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

    const result = await chat.sendMessage(message);
    const reply = result.response.text();

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
