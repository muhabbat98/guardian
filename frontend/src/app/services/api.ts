const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
): Promise<T> {
  const headers: HeadersInit = { 'Content-Type': 'application/json' };

  // Add JWT token if available
  const token = localStorage.getItem('GUARDIAN_TOKEN');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}/api${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  // Handle 401 - clear token but don't auto-redirect to prevent loops
  if (res.status === 401) {
    localStorage.removeItem('GUARDIAN_TOKEN');
  }

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

// ── Appointments ──────────────────────────────────────────
export const appointmentsApi = {
  getAll: (parentId?: string, teacherId?: string) => {
    const params = new URLSearchParams();
    if (parentId) params.append('parentId', parentId);
    if (teacherId) params.append('teacherId', teacherId);
    const qs = params.toString() ? `?${params.toString()}` : '';
    return get<any[]>(`/appointments${qs}`);
  },
  getOne: (id: string) => get<any>(`/appointments/${id}`),
  create: (data: any) => post<any>('/appointments', data),
  update: (id: string, data: any) => put<any>(`/appointments/${id}`, data),
  remove: (id: string) => del(`/appointments/${id}`),
};

// ── Dashboard ─────────────────────────────────────────────────
export const dashboardApi = {
  getStats: () => get<any>('/dashboard/stats'),
  getAlerts: () => get<any[]>('/dashboard/alerts'),
};
