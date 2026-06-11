import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

// Get all members of a group
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
    .select("id, role, joined_at, user_id")
    .eq("group_id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ members });
}

// Update member role or remove member
export async function PATCH(request, { params }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  // Check if the requester is an admin
  const { data: requester } = await supabase
    .from("group_members")
    .select("role")
    .eq("group_id", id)
    .eq("user_id", user.id)
    .single();

  if (!requester || requester.role !== "admin") {
    return NextResponse.json(
      { error: "Only admins can do this" },
      { status: 403 },
    );
  }

  const { targetUserId, action } = await request.json();

  if (targetUserId === user.id) {
    return NextResponse.json(
      { error: "You cannot modify your own role" },
      { status: 400 },
    );
  }

  if (action === "remove") {
    const { error } = await supabase
      .from("group_members")
      .delete()
      .eq("group_id", id)
      .eq("user_id", targetUserId);

    if (error)
      return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ message: "Member removed" });
  }

  if (action === "make_admin") {
    const { error } = await supabase
      .from("group_members")
      .update({ role: "admin" })
      .eq("group_id", id)
      .eq("user_id", targetUserId);

    if (error)
      return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ message: "Member promoted to admin" });
  }

  if (action === "remove_admin") {
    const { error } = await supabase
      .from("group_members")
      .update({ role: "member" })
      .eq("group_id", id)
      .eq("user_id", targetUserId);

    if (error)
      return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ message: "Admin role removed" });
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}

// Leave group
export async function DELETE(request, { params }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  // Check if user is the group creator — creator cannot leave
  const { data: group } = await supabase
    .from("groups")
    .select("created_by")
    .eq("id", id)
    .single();

  if (group?.created_by === user.id) {
    return NextResponse.json(
      { error: "You created this group. Delete it instead of leaving." },
      { status: 400 },
    );
  }

  const { error } = await supabase
    .from("group_members")
    .delete()
    .eq("group_id", id)
    .eq("user_id", user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: "Left group successfully" });
}
