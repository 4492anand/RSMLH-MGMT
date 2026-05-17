import axios from 'axios';

const api = axios.create({ baseURL: '/rsmlhmgmt' });

// Patients
export const getPatients = () => api.get('/patients/allPatients');
export const getPatientById = (id) => api.get(`/patients/patientId/${id}`);
export const createPatient = (data) => api.post('/patients/registerPatient', data);
export const updatePatient = (id, data) => api.put(`/patients/updatePatient/${id}`, data);
export const deletePatient = (id) => api.delete(`/patients/deletePatient/${id}`);

// Doctors
export const getDoctors = () => api.get('/doctors/getAllDoctors');
export const getDoctorById = (id) => api.get(`/doctors/doctorId/${id}`);
export const createDoctor = (data) => api.post('/doctors/addDoctor', data);
export const updateDoctor = (id, data) => api.put(`/doctors/updateDoctor/${id}`, data);

// Appointments
export const getAppointments = () => api.get('/appointments/allAppointments');
export const getAppointmentById = (id) => api.get(`/appointments/getAppointment/${id}`);
export const createAppointment = (data) => api.post('/appointments/schedule', data);
export const updateAppointment = (id, params) =>
  api.put(`/appointments/updateappointment/${id}`, null, { params });
