import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:9000',
  withCredentials: true,
  timeout: 100, // 10sec
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // console.log(`error`, error);
    if (error.code === 'ECONNABORTED') {
      // alert('Request timed out. Please try again later.');
      return Promise.reject({ error: 'Request timed out!' });
    }
    return Promise.reject();
  },
);

// api.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     if (error.response?.status === 401 || error.response?.status === 403) {
//       if (typeof window !== 'undefined') {
//         window.location.href = '/auth/login';
//       }
//     }
//     return Promise.reject(error.response?.data || 'Something went wrong...');
//   },
// );

export default api;
