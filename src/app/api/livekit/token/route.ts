import { NextResponse } from "next/server";
import { AccessToken } from "livekit-server-sdk";

export async function POST(req: Request) {
  try {
    const { roomName, participantName } = await req.json();

    if (!roomName || !participantName) {
      return NextResponse.json({ error: "roomName and participantName required" }, { status: 400 });
    }

    const apiKey = process.env.LIVEKIT_API_KEY;
    const apiSecret = process.env.LIVEKIT_API_SECRET;

    if (!apiKey || !apiSecret) {
      return NextResponse.json(
        {
          error: "LiveKit not configured",
          message: "Добавь LIVEKIT_API_KEY и LIVEKIT_API_SECRET в .env",
        },
        { status: 503 }
      );
    }

    const at = new AccessToken(apiKey, apiSecret, {
      identity: participantName,
      name: participantName,
    });

    at.addGrant({
      roomJoin: true,
      room: roomName,
      canPublish: true,
      canSubscribe: true,
    });

    const token = await at.toJwt();

    return NextResponse.json({
      token,
      url: process.env.NEXT_PUBLIC_LIVEKIT_URL || process.env.LIVEKIT_URL,
    });
  } catch (error) {
    console.error("LiveKit token error:", error);
    return NextResponse.json({ error: "Failed to generate token" }, { status: 500 });
  }
}
