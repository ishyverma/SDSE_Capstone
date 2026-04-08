import { prisma } from '@/lib/prisma';

export class PaymentRepository {
  async getAllPayments() {
    return prisma.payment.findMany();
  }

  async createPaymentRecord(userId: string, amount: number, method: string) {
    return prisma.payment.create({
      data: {
        userId: userId,
        amount: amount,
        method: method,
        status: 'PAID'
      }
    });
  }
}
