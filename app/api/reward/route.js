import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// ✅ Secure Supabase client (use Service Role key only in backend!)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(req) {
  try {
    const body = await req.json();   // ✅ Fix
    const { action, plate_no , payment_mode} = body;

    console.log("👉 Received body:", body);

    // Step 1: Validate request
    if (action !== "get_reward") {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    if (!plate_no || typeof plate_no !== "string") {
      return NextResponse.json({ error: "plate_no is required" }, { status: 400 });
    }

    // Step 2: Check unique_tokens table
    const { data: tokenRecord, error: tokenErr } = await supabase
      .from("unique_tokens")
      .select("*")
      .eq("plate_no", plate_no)
      .maybeSingle();

    if (tokenErr) {
      console.error("DB error:", tokenErr);
      return NextResponse.json({ error: tokenErr.message }, { status: 500 });
    }

    if (!tokenRecord) {
      return NextResponse.json(
        { error: "Invalid or unregistered plate number" },
        { status: 404 }
      );
    }

    if (tokenRecord.used) {
      return NextResponse.json(
        { error: "This plate number has expired." },
        { status: 403 }
      );
    }

    const now = new Date().toISOString();

    // Step 3: Mark token as used
    const { error: updateErr } = await supabase
      .from("unique_tokens")
      .update({ used: true, used_at: now })
      .eq("plate_no", plate_no);

    if (updateErr) {
      console.error("Update error:", updateErr);
      return NextResponse.json({ error: updateErr.message }, { status: 500 });
    }

    // Step 4: Insert into reward_tokens (log)
    const { error: logInsertErr } = await supabase.from("reward_tokens").insert([
      {
        token: tokenRecord.token,
        reward: tokenRecord.reward,
        plate_no: plate_no,
        used: true,
        used_at: now,
        payment_mode: payment_mode,
      },
    ]);

    if (logInsertErr) {
      console.error("Log insert error:", logInsertErr);
      return NextResponse.json({ error: logInsertErr.message }, { status: 500 });
    }

    // Step 5: Send secure response
    return NextResponse.json(
      {
        token: tokenRecord.token,
        reward: tokenRecord.reward,
        message:
          tokenRecord.reward === 0
            ? "😢 Oops! You got 0 pani puri free. Better luck next time!"
            : `🎉 Congratulations! You got ${tokenRecord.reward} pani puri free!`,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Backend error:", err);
    return NextResponse.json(
      { error: err.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}