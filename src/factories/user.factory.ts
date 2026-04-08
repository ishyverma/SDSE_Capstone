import { prisma } from '@/lib/prisma'
import { User } from '@prisma/client'

// OOP: Encapsulation (Hiding creation logic)
// Design Pattern: Factory Method
// Purpose: Provides a centralized place to create User instances (Admin/Student)
// without exposing the instantiation logic to the client.

export class UserFactory {
  static async createUser(type: 'ADMIN' | 'STUDENT', name: string, email: string): Promise<User> {
    // SOLID: Single Responsibility Principle (Factory is only responsible for creation)
    if (type === 'ADMIN') {
      return prisma.user.create({
        data: {
          name,
          email,
          role: 'ADMIN'
        }
      })
    } else if (type === 'STUDENT') {
      return prisma.user.create({
        data: {
          name,
          email,
          role: 'STUDENT'
        }
      })
    }
    
    throw new Error('Invalid user type')
  }
}
