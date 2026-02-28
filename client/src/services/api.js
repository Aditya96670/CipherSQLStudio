import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

export const getAssignments = () => API.get("/assignments");

export const getAssignmentById = (id) => API.get(`/assignments/${id}`);

export const executeQuery = (query) => API.post("/execute-query", { query});

export const getSampleData = (id) => API.get(`/assignments/${id}/sample-data`);

export const getHint = (id, description) =>  API.post(`/assignments/${id}/hint`, {description,});