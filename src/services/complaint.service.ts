import { ComplaintRepository } from '../repositories/complaint.repository';

export class ComplaintService {
  private complaintRepository: ComplaintRepository;

  constructor() {
    this.complaintRepository = new ComplaintRepository();
  }

  async getAllComplaints() {
    return this.complaintRepository.getAllComplaints();
  }

  async raiseComplaint(userId: string, title: string, description: string) {
    return this.complaintRepository.createComplaint(userId, title, description);
  }

  async resolveComplaint(complaintId: string) {
    return this.complaintRepository.resolveComplaint(complaintId);
  }
}
