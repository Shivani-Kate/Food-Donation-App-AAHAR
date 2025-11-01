
import axios from "axios";

const API = "http://localhost:5000/api";
export const API_URL = API;


export const signup = async (data) => {
  const res = await axios.post(`${API}/auth/signup`, data);
  return res.data;
};


export const signin = async (data) => {
  const res = await axios.post(`${API}/auth/signin`, data);
  return res.data;
};

export const getProfile = async () => {
  const token = localStorage.getItem("token");
  const res = await axios.get(`${API}/auth/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};


export const updateProfile = async (data) => {
  const token = localStorage.getItem("token");
  const res = await axios.put(`${API}/auth/profile`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};


export const addDonation = async (data) => {
  const token = localStorage.getItem("token");
  const res = await axios.post(`${API}/donations`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};


export const deleteDonation = async (id) => {
  const token = localStorage.getItem("token");
  const res = await axios.delete(`${API}/donations/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};


export const getUserActivities = async (role) => {
  const token = localStorage.getItem("token");
  const res = await axios.get(`${API}/donations/activities?role=${role}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};


export const getRequests = async () => {
  const token = localStorage.getItem("token");
  const res = await axios.get(`${API}/requests`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};


export const sendConfirmation = async (donationId) => {
  const token = localStorage.getItem("token");
  const res = await axios.post(
    `${API}/donations/${donationId}/confirm`,
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};


export const getDonations = async () => {
  const token = localStorage.getItem("token");
  const res = await axios.get(`${API}/donations`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};


export const getReceivedDonations = async () => {
  const token = localStorage.getItem("token");
  const res = await axios.get(`${API}/donations/receiver`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
