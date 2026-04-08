import { prisma } from '@/lib/prisma';
import { User } from '@prisma/client';

// OOP: Encapsulation (Grouping data access methods for Users)
// SOLID: Single Responsibility Principle (Handles only User data access)
export class UserRepository {
  
  async getAllUsers() {
    return prisma.user.findMany();
  }

  async getUserById(id: string) {
    return prisma.user.findUnique({ where: { id: id } });
  }

  async createUser(name: string, email: string, role: string) {
    return prisma.user.create({
      data: {
        name: name,
        email: email,
        role: role
      }
    });
  }

  async deleteUser(id: string) {
    await prisma.user.delete({ where: { id: id } });
    return true;
  }
}
