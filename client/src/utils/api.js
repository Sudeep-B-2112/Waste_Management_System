export const API = 'http://localhost:3000/api';
export const BASE = 'http://localhost:3000';

export async function apiRequest(token, path, method = 'GET', body, form = false) {
  const headers = form
    ? { Authorization: `Bearer ${token}` }
    : { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };

  const res = await fetch(API + path, {
    method,
    headers,
    body: body ? (form ? body : JSON.stringify(body)) : undefined,
  });

  const data = await res.json();

  if (!res.ok) throw new Error(data.message || 'Something went wrong');

  return data;
}