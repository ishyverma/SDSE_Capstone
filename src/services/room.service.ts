import { RoomRepository } from '../repositories/room.repository';

// SOLID: Single Responsibility Principle
export class RoomService {
  private roomRepository: RoomRepository;

  constructor() {
    this.roomRepository = new RoomRepository();
  }

  async getAllRooms() {
    return this.roomRepository.getAllRooms();
  }

  async addRoom(roomNo: string, capacity: number) {
    return this.roomRepository.createRoom(roomNo, capacity);
  }

  async assignRoom(roomId: string, userId: string) {
    // In a real application, you handle capacity checks here
    return this.roomRepository.assignStudentToRoom(roomId, userId);
  }

  async vacateRoom(userId: string) {
    return this.roomRepository.vacateRoom(userId);
  }
}
