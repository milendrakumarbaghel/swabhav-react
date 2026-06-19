import axios from "axios";

const API_BASE = import.meta.env.VITE_APP_API_BASE || "http://localhost:8080";

const api = axios.create({
  baseURL: API_BASE,
});

api.interceptors.request.use((config) => {
  const token = import.meta.env.VITE_APP_JWT_TOKEN;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

/** Convert a snake_case string to camelCase */
function toCamel(str) {
  return str.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
}

/** Recursively transform all keys in an object/array from snake_case to camelCase */
function transformKeys(data) {
  if (Array.isArray(data)) {
    return data.map(transformKeys);
  }
  if (data !== null && typeof data === "object") {
    const result = {};
    for (const key of Object.keys(data)) {
      result[toCamel(key)] = transformKeys(data[key]);
    }
    return result;
  }
  return data;
}

export async function fetchAllStudents() {
  const res = await api.get("/api/students");
  return transformKeys(res.data);
}

export async function fetchStudentCourses(studentId) {
  const res = await api.get(`/api/students/${studentId}/courses`);
  return transformKeys(res.data);
}

export async function fetchCourseDetail(courseId) {
  const res = await api.get(`/api/courses/${courseId}`);
  return transformKeys(res.data);
}

export async function fetchStudentDetailById(studentId) {
  const res = await api.get(`/api/students/${studentId}`);
  return transformKeys(res.data);
}


export const fetchProducts = async () => {
    const res = await api.get(`${API_BASE}/api/products`);
    return transformKeys(res.data);
};

export const fetchCustomers = async () => {
    const res = await api.get(`${API_BASE}/api/users/customers`);
    return transformKeys(res.data);
};

export const fetchPolicies = async () => {
    const res = await api.get(`${API_BASE}/api/policies`);
    return transformKeys(res.data);
};
