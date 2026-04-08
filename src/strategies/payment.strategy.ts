// OOP: Abstraction & Polymorphism
// Design Pattern: Strategy
// Purpose: Allows swapping out different payment processing algorithms dynamically
// without changing the core Payment Service logic.
// SOLID: Open/Closed Principle (New payment methods can be added without modifying existing code)

export interface IPaymentStrategy {
  pay(amount: number): Promise<boolean>;
}

export class CreditCardStrategy implements IPaymentStrategy {
  async pay(amount: number): Promise<boolean> {
    // Simulate credit card API call processing
    console.log(`Processing credit card payment of $${amount}...`)
    return true; // Assume success
  }
}

export class UPIStrategy implements IPaymentStrategy {
  async pay(amount: number): Promise<boolean> {
    // Simulate UPI processing
    console.log(`Processing UPI payment of $${amount}...`)
    return true; // Assume success
  }
}

export class CashStrategy implements IPaymentStrategy {
  async pay(amount: number): Promise<boolean> {
    // Simulate logging manual cash entry
    console.log(`Logging cash payment received: $${amount}...`)
    return true; // Assume success
  }
}

// Context class that uses the strategy
export class PaymentContext {
  private strategy: IPaymentStrategy;

  constructor(strategy: IPaymentStrategy) {
    this.strategy = strategy;
  }

  setStrategy(strategy: IPaymentStrategy) {
    this.strategy = strategy;
  }

  async executePayment(amount: number): Promise<boolean> {
    return this.strategy.pay(amount);
  }
}
