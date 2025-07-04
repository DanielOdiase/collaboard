import { Liveblocks } from "@liveblocks/node";
import { NextRequest } from "next/server";

const liveblocks = new Liveblocks({
    secret: process.env.LIVEBLOCKS_SECRET_KEY!,
});

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        // Accept both 'room' and 'roomId' for compatibility
        const roomId = body.room || body.roomId;
        const userId = `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const safeRoomId = roomId || `room-${Date.now()}`;

        const session = liveblocks.prepareSession(userId, {
            userInfo: {
                name: 'Guest',
                color: '#3b82f6',
            },
        });

        session.allow(safeRoomId, session.FULL_ACCESS);

        const { status, body: responseBody } = await session.authorize();
        return new Response(responseBody, { status });
    } catch (error) {
        console.error("Error generating token:", error);
        return new Response("Internal Server Error", { status: 500 });
    }
} 