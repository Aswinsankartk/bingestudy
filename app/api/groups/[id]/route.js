import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function DELETE(request, { params }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  // Only the group creator can delete the group
  const { data: group } = await supabase
    .from("groups")
    .select("created_by")
    .eq("id", id)
    .single();

  if (!group) {
    return NextResponse.json({ error: "Group not found" }, { status: 404 });
  }

  if (group.created_by !== user.id) {
    return NextResponse.json(
      { error: "Only the group creator can delete this group" },
      { status: 403 },
    );
  }

  const { error } = await supabase.from("groups").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: "Group deleted" });
}

export async function GET(request, { params }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const { data: members, error } = await supabase
    .from("group_members")
    .select(
      "id, role, joined_at, user_id, profiles(full_name, email, avatar_url)",
    )
    .eq("group_id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ members });
}
