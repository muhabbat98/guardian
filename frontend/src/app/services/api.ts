const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(error.message || `Request failed: ${res.status}`);
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

const get = <T>(path: string) => request<T>('GET', path);
const post = <T>(path: string, body: unknown) => request<T>('POST', path, body);
const put = <T>(path: string, body: unknown) => request<T>('PUT', path, body);
const del = (path: string) => request<void>('DELETE', path);

// ── Activities ────────────────────────────────────────────────
export const activitiesApi = {
  getAll: () => get<any[]>('/activities'),
  getOne: (id: string) => get<any>(`/activities/${id}`),
  create: (data: any) => post<any>('/activities', data),
  update: (id: string, data: any) => put<any>(`/activities/${id}`, data),
  remove: (id: string) => del(`/activities/${id}`),
};

// ── Students ──────────────────────────────────────────────────
export const studentsApi = {
  getAll: () => get<any[]>('/students'),
  getOne: (id: string) => get<any>(`/students/${id}`),
  create: (data: any) => post<any>('/students', data),
  update: (id: string, data: any) => put<any>(`/students/${id}`, data),
  remove: (id: string) => del(`/students/${id}`),
};

// ── Teachers ──────────────────────────────────────────────────
export const teachersApi = {
  getAll: () => get<any[]>('/teachers'),
  getOne: (id: string) => get<any>(`/teachers/${id}`),
  create: (data: any) => post<any>('/teachers', data),
  update: (id: string, data: any) => put<any>(`/teachers/${id}`, data),
  remove: (id: string) => del(`/teachers/${id}`),
};

// ── Attendance ────────────────────────────────────────────────
export const attendanceApi = {
  getAll: (params?: { studentId?: string; activityId?: string }) => {
    const qs = params
      ? '?' + new URLSearchParams(Object.entries(params).filter(([, v]) => v) as any).toString()
      : '';
    return get<any[]>(`/attendance${qs}`);
  },
  create: (data: any) => post<any>('/attendance', data),
  update: (id: string, data: any) => put<any>(`/attendance/${id}`, data),
  remove: (id: string) => del(`/attendance/${id}`),
};

// ── Payments ──────────────────────────────────────────────────
export const paymentsApi = {
  getAll: (studentId?: string) => {
    const qs = studentId ? `?studentId=${studentId}` : '';
    return get<any[]>(`/payments${qs}`);
  },
  create: (data: any) => post<any>('/payments', data),
  update: (id: string, data: any) => put<any>(`/payments/${id}`, data),
  remove: (id: string) => del(`/payments/${id}`),
};

// ── Agreements ────────────────────────────────────────────────
export const agreementsApi = {
  getAll: (studentId?: string) => {
    const qs = studentId ? `?studentId=${studentId}` : '';
    return get<any[]>(`/agreements${qs}`);
  },
  create: (data: any) => post<any>('/agreements', data),
  update: (id: string, data: any) => put<any>(`/agreements/${id}`, data),
  remove: (id: string) => del(`/agreements/${id}`),
};

// ── Dashboard ─────────────────────────────────────────────────
export const dashboardApi = {
  getStats: () => get<any>('/dashboard/stats'),
  getAlerts: () => get<any[]>('/dashboard/alerts'),
};
