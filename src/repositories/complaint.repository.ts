import { prisma } from '@/lib/prisma';

export class ComplaintRepository {
  async getAllComplaints() {
    return prisma.complaint.findMany();
  }

  async createComplaint(userId: string, title: string, description: string) {
    return prisma.complaint.create({
      data: {
        userId: userId,
        title: title,
        description: description,
        status: 'OPEN'
      }
    });
  }

  async resolveComplaint(complaintId: string) {
    return prisma.complaint.update({
      where: { id: complaintId },
      data: { status: 'RESOLVED' }
    });
  }
}
