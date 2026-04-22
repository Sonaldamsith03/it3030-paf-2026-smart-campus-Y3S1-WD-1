import api from '../../shared/services/api';

export type ResourceStatus = 'ACTIVE' | 'OUT_OF_SERVICE' | 'MAINTENANCE';
export type ResourceType = 'LECTURE_HALL' | 'LAB' | 'EQUIPMENT';

export interface Resource {
  id: string;
  name: string;
  type: ResourceType;
  faculty: string;
  building: string;
  capacity: number;
  location: string;
  status: ResourceStatus;
  description: string;
}

export const resourceService = {
  getResources: async (): Promise<Resource[]> => {
    const response = await api.get('/resources');
    return response.data;
  },

  createResource: async (data: Partial<Resource>): Promise<Resource> => {
    const response = await api.post('/resources', data);
    return response.data;
  },

  updateResource: async (id: string, data: Partial<Resource>): Promise<Resource> => {
    const response = await api.put(`/resources/${id}`, data);
    return response.data;
  },

  deleteResource: async (id: string): Promise<void> => {
    await api.delete(`/resources/${id}`);
  }
};
