import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = createClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const eventData = await request.json();

    // Add the user ID of the event creator
    const eventWithUser = {
      ...eventData,
      user_id: session.user.id,
      registered: 0, // Initialize with 0 registered attendees
    };

    // Insert the event into the database
    const { data, error } = await supabase
      .from("events")
      .insert([eventWithUser])
      .select()
      .single();

    if (error) {
      console.error("Error creating event:", error);
      return new NextResponse(
        JSON.stringify({ error: "Failed to create event" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in API route:", error);
    return new NextResponse(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
