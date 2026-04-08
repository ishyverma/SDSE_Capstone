import { prisma } from '@/lib/prisma';

export class RoomRepository {
  async getAllRooms() {
    return prisma.room.findMany({ include: { occupants: true } });
  }

  async createRoom(roomNo: string, capacity: number) {
    return prisma.room.create({
      data: {
        roomNo: roomNo,
        capacity: capacity,
        status: 'AVAILABLE'
      }
    });
  }

  async assignStudentToRoom(roomId: string, userId: string) {
    return prisma.user.update({
      where: { id: userId },
      data: { roomId: roomId }
    });
  }

  async vacateRoom(userId: string) {
    return prisma.user.update({
      where: { id: userId },
      data: { roomId: null }
    });
  }
}
