 import axios from "axios";
 import { jwtDecode } from 'jwt-decode'
 
const API_BASE = "http://localhost:8080";

const api = axios.create({
  baseURL: API_BASE,
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

export const login = async (user) => {
  const res = await api.post("/api/auth/login", user, {
    headers: { "Content-Type": "application/json" },
  });
  return transformKeys(res.data);
};

export default api;
