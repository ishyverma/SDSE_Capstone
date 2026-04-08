import { NextRequest, NextResponse } from 'next/server';
import { ComplaintService } from '@/services/complaint.service';

const complaintService = new ComplaintService();

export async function GET() {
  try {
    const complaints = await complaintService.getAllComplaints();
    return NextResponse.json(complaints);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, title, description } = body;
    const complaint = await complaintService.raiseComplaint(userId, title, description);
    return NextResponse.json(complaint, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { complaintId } = body;
    const complaint = await complaintService.resolveComplaint(complaintId);
    return NextResponse.json(complaint, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
