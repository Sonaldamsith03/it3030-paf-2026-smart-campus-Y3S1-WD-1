export type TicketStatus = 'OPEN' | 'REJECTED' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
export type TicketPriority = 'LOW' | 'MEDIUM' | 'HIGH';
export type TicketCategory = 'FACILITY' | 'IT' | 'ACADEMIC' | 'SECURITY' | 'OTHER';

export interface TicketComment {
  id: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: string;
}

export interface TicketAttachment {
  id: string;
  url: string;
  fileName: string;
}

export interface Ticket {
  id: string;
  title: string;
  description: string;
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  location: string;
  faculty: string;
  email: string;
  createdBy: string;
  createdByName: string;
  assignedTo?: string;
  assignedToName?: string;
  assignedByAdmin?: boolean;
  createdAt: string;
  updatedAt: string;
  rejectionReason?: string;
  resolutionNotes?: string;
  comments: TicketComment[];
  attachments: TicketAttachment[];
}
