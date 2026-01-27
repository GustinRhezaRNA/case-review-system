import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:3000',
});

export const setUserHeader = (userId: string) => {
  api.defaults.headers.common['x-user-id'] = userId;
};
