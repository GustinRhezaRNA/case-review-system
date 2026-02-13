import { axiosConfig } from '@/lib/axios/config';
import axios from 'axios';

export const api = axios.create(axiosConfig);

export const setUserHeader = (userId: string) => {
  api.defaults.headers.common['x-user-id'] = userId;
};
