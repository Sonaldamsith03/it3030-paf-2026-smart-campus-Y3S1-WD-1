import api from '../../shared/services/api';
import { Ticket, TicketStatus } from './ticket';

export const technicianService = {
  /**
   * Get all tickets assigned to the logged-in technician
   */
  getAssignedTickets: async (technicianId: string): Promise<Ticket[]> => {
    const response = await api.get<Ticket[]>(`/tickets?technicianId=${technicianId}`);
    return response.data;
  },

  /**
   * Get a single ticket by ID
   */
  getTicketById: async (id: string): Promise<Ticket> => {
    const response = await api.get<Ticket>(`/tickets/${id}`);
    return response.data;
  },

  /**
   * Get all tickets in the system
   */
  getAllTickets: async (): Promise<Ticket[]> => {
    const response = await api.get<Ticket[]>('/tickets');
    return response.data;
  },

  /**
   * Self-assign a ticket to the logged-in technician
   */
  selfAssignTicket: async (id: string, techId: string, techName: string): Promise<Ticket> => {
    const response = await api.patch<Ticket>(`/tickets/${id}/self-assign`, { 
      technicianId: techId, 
      technicianName: techName 
    });
    return response.data;
  },

  /**
   * Update the status of a ticket
   */
  updateTicketStatus: async (id: string, status: TicketStatus, resolutionNotes?: string): Promise<Ticket> => {
    const response = await api.patch<Ticket>(`/tickets/${id}/status`, { 
      status, 
      resolutionNotes 
    });
    return response.data;
  },

  /**
   * Add a comment to a ticket
   */
  addComment: async (id: string, content: string): Promise<void> => {
    await api.post(`/tickets/${id}/comments`, { content });
  }
};
