// api.js
import axios from 'axios';

const API = axios.create({ baseURL: 'http://127.0.0.1:5000/api' });

API.interceptors.request.use((req) => {
  const user = JSON.parse(localStorage.getItem('profile'));
  if (user) {
    req.headers.Authorization = `Bearer ${user.token}`;
    req.headers.userid = user.user._id
  }
  return req;
});

// Auth Endpoints
export const signIn = (formData) => API.post('/auth/login', formData);
export const signUp = (formData) => API.post('/auth/register', formData);

// Form Endpoints
export const createForm = (formData) => API.post('/forms', formData);
export const getForm = (uuid) => API.get(`/forms/${uuid}`);
export const updateForm = (uuid, formData) => API.put(`/forms/${uuid}`, formData);
export const deleteForm = (uuid) => API.delete(`/forms/${uuid}`);
export const addQuestion = (uuid, questionData) => API.post(`/forms/${uuid}/questions`, questionData);
export const submitForm = (uuid, responses) => API.post(`/forms/${uuid}/submit`, responses);
export const updateResponse = (uuid, responses) => API.put(`/forms/${uuid}/submit`, responses);
export const getUserForms = () => API.get('/forms');
export const getRespondents = (uuid) => API.get(`/forms/${uuid}/respondents`);
export const getFormResponses = (uuid) => API.get(`/forms/${uuid}/responses`);
