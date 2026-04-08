import { NextRequest, NextResponse } from 'next/server';
import { UserService } from '@/services/user.service';

// API Controller for Users
const userService = new UserService();

export async function GET() {
  try {
    const users = await userService.getAllUsers();
    return NextResponse.json(users);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, name, email } = body;
    
    // Abstracting creation using our UserService and underlying Factory pattern
    const user = await userService.registerUser(type, name, email);
    return NextResponse.json(user, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
