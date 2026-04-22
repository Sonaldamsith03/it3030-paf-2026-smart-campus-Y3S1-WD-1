import api from '../../shared/services/api';
import { Ticket, TicketStatus, TicketPriority, TicketCategory } from './ticket';

export const ticketService = {
  getTickets: async (role: string, userId: string): Promise<Ticket[]> => {
    let url = '/tickets';
    if (role === 'TECHNICIAN') {
      url += `?technicianId=${userId}`;
    } else if (role === 'USER') {
      url += `?userId=${userId}`;
    }
    const response = await api.get<Ticket[]>(url);
    return response.data;
  },

  getTicketById: async (id: string): Promise<Ticket | undefined> => {
    const response = await api.get<Ticket>(`/tickets/${id}`);
    return response.data;
  },

  createTicket: async (data: Partial<Ticket>): Promise<Ticket> => {
    const response = await api.post<Ticket>('/tickets', data);
    return response.data;
  },

  updateStatus: async (id: string, status: TicketStatus, notes?: string): Promise<void> => {
    await api.patch(`/tickets/${id}/status`, { status, resolutionNotes: notes });
  },

  assignTechnician: async (id: string, techId: string, techName: string): Promise<void> => {
    await api.patch(`/tickets/${id}/assign`, { technicianId: techId, technicianName: techName });
  },

  addComment: async (id: string, userId: string, userName: string, content: string): Promise<void> => {
    // Note: Backend might need a comment endpoint. If not, we might need to update the ticket object.
    // For now, let's assume there's a comment endpoint as per the previous mock.
    await api.post(`/tickets/${id}/comments`, { userId, userName, content });
  }
};
