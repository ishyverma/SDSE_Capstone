import { NextRequest, NextResponse } from 'next/server';
import { RoomService } from '@/services/room.service';

const roomService = new RoomService();

export async function GET() {
  try {
    const rooms = await roomService.getAllRooms();
    return NextResponse.json(rooms);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { roomNo, capacity } = body;
    const room = await roomService.addRoom(roomNo, Number(capacity));
    return NextResponse.json(room, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { roomId, userId, action } = body;
    
    if (action === 'ASSIGN') {
      const user = await roomService.assignRoom(roomId, userId);
      return NextResponse.json(user, { status: 200 });
    } else if (action === 'VACATE') {
      const user = await roomService.vacateRoom(userId);
      return NextResponse.json(user, { status: 200 });
    }
    
    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
