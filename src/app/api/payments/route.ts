import { NextRequest, NextResponse } from 'next/server';
import { PaymentService } from '@/services/payment.service';

const paymentService = new PaymentService();

export async function GET() {
  try {
    const payments = await paymentService.getAllPayments();
    return NextResponse.json(payments);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, amount, method } = body;
    
    const payment = await paymentService.processPayment(userId, amount, method);
    return NextResponse.json({ message: "Payment processed successfully", payment }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
