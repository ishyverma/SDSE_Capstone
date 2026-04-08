import { UserRepository } from '../repositories/user.repository';
import { UserFactory } from '../factories/user.factory';

// OOP: Encapsulation
// SOLID: Single Responsibility Principle (Handles business logic for Users)
export class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async getAllUsers() {
    return this.userRepository.getAllUsers();
  }

  async registerUser(type: 'ADMIN' | 'STUDENT', name: string, email: string) {
    // Design Pattern: Factory is used here to abstract instantiation
    return UserFactory.createUser(type, name, email);
  }
}
