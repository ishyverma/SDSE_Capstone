import { PaymentRepository } from '../repositories/payment.repository';
import { PaymentContext, CreditCardStrategy, UPIStrategy, CashStrategy } from '../strategies/payment.strategy';

// SOLID: Open/Closed Principle
// You can add new payment methods without changing this service logic, 
// just by adding a new strategy class.
export class PaymentService {
  private paymentRepository: PaymentRepository;

  constructor() {
    this.paymentRepository = new PaymentRepository();
  }

  async processPayment(userId: string, amount: number, method: 'CREDIT_CARD' | 'UPI' | 'CASH') {
    let strategy;

    // Select the appropriate strategy
    switch (method) {
      case 'CREDIT_CARD':
        strategy = new CreditCardStrategy();
        break;
      case 'UPI':
        strategy = new UPIStrategy();
        break;
      case 'CASH':
        strategy = new CashStrategy();
        break;
      default:
        throw new Error('Invalid payment method');
    }

    const context = new PaymentContext(strategy);
    const success = await context.executePayment(amount);

    if (success) {
      return this.paymentRepository.createPaymentRecord(userId, amount, method);
    }
    
    throw new Error('Payment failed');
  }

  async getAllPayments() {
    return this.paymentRepository.getAllPayments();
  }
}
