import api from './api';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN' | 'TECHNICIAN';
}

export const userService = {
  getTechnicians: async (): Promise<User[]> => {
    const response = await api.get('/users/technicians');
    return response.data;
  },
  
  getAllUsers: async (): Promise<User[]> => {
    const response = await api.get('/users');
    return response.data;
  }
};
