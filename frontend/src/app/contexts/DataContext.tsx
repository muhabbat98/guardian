import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import {
  activitiesApi,
  studentsApi,
  teachersApi,
  attendanceApi,
  paymentsApi,
  agreementsApi,
  appointmentsApi,
} from '../services/api';

export interface Activity {
  id: string;
  name: string;
  time: string;
  dayOfWeek: string;
  students: string[];
  teachers: string[];
  description?: string;
  capacity?: number;
}

export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  guardianName: string;
  guardianPhone: string;
  guardianEmail: string;
  address?: string;
  enrollmentDate: string;
  activities: string[];
}

export interface Agreement {
  id: string;
  studentId: string;
  agreementDate: string;
  startDate: string;
  endDate: string;
  terms: string;
  signedBy: string;
  status: 'active' | 'expired' | 'pending';
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  activityId: string;
  date: string;
  status: 'present' | 'absent' | 'excused';
  notes?: string;
}

export interface Payment {
  id: string;
  studentId: string;
  amount: number;
  date: string;
  method: 'cash' | 'card' | 'transfer' | 'other';
  status: 'paid' | 'pending' | 'overdue';
  dueDate: string;
  description?: string;
}

export interface Teacher {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  specialization: string;
}

export interface Appointment {
  id: string;
  parentId: string;
  teacherId: string;
  title: string;
  description?: string;
  scheduledAt: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
}

interface DataContextType {
  activities: Activity[];
  students: Student[];
  agreements: Agreement[];
  attendance: AttendanceRecord[];
  payments: Payment[];
  teachers: Teacher[];
  appointments: Appointment[];
  loading: boolean;
  operationLoading: boolean;
  error: string | null;
  refreshAll: () => Promise<void>;
  addActivity: (activity: Omit<Activity, 'id'>) => Promise<void>;
  updateActivity: (id: string, activity: Partial<Activity>) => Promise<void>;
  deleteActivity: (id: string) => Promise<void>;
  addStudent: (student: Omit<Student, 'id'>) => Promise<void>;
  updateStudent: (id: string, student: Partial<Student>) => Promise<void>;
  deleteStudent: (id: string) => Promise<void>;
  addAgreement: (agreement: Omit<Agreement, 'id'>) => Promise<void>;
  updateAgreement: (id: string, agreement: Partial<Agreement>) => Promise<void>;
  addAttendance: (attendance: Omit<AttendanceRecord, 'id'>) => Promise<void>;
  updateAttendance: (id: string, attendance: Partial<AttendanceRecord>) => Promise<void>;
  addPayment: (payment: Omit<Payment, 'id'>) => Promise<void>;
  updatePayment: (id: string, payment: Partial<Payment>) => Promise<void>;
  addTeacher: (teacher: Omit<Teacher, 'id'>) => Promise<void>;
  updateTeacher: (id: string, teacher: Partial<Teacher>) => Promise<void>;
  deleteTeacher: (id: string) => Promise<void>;
  addAppointment: (appointment: Omit<Appointment, 'id'>) => Promise<void>;
  updateAppointment: (id: string, appointment: Partial<Appointment>) => Promise<void>;
  deleteAppointment: (id: string) => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within DataProvider');
  return context;
};

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [agreements, setAgreements] = useState<Agreement[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [operationLoading, setOperationLoading] = useState(false);

  const fetchAll = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [
        activitiesData,
        studentsData,
        teachersData,
        attendanceData,
        paymentsData,
        agreementsData,
        appointmentsData,
      ] = await Promise.all([
        activitiesApi.getAll(),
        studentsApi.getAll(),
        teachersApi.getAll(),
        attendanceApi.getAll(),
        paymentsApi.getAll(),
        agreementsApi.getAll(),
        appointmentsApi.getAll(),
      ]);
      setActivities(activitiesData);
      setStudents(studentsData);
      setTeachers(teachersData);
      setAttendance(attendanceData);
      setPayments(paymentsData);
      setAgreements(agreementsData);
      setAppointments(appointmentsData);
    } catch (err: any) {
      setError(err.message || 'Failed to connect to server');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  // ── Activities ────────────────────────────────────────────
  const addActivity = async (data: Omit<Activity, 'id'>) => {
    try {
      setOperationLoading(true);
      await activitiesApi.create(data);
      const updated = await activitiesApi.getAll();
      setActivities(updated);
    } finally {
      setOperationLoading(false);
    }
  };

  const updateActivity = async (id: string, data: Partial<Activity>) => {
    try {
      setOperationLoading(true);
      await activitiesApi.update(id, data);
      const updated = await activitiesApi.getAll();
      setActivities(updated);
    } finally {
      setOperationLoading(false);
    }
  };

  const deleteActivity = async (id: string) => {
    try {
      setOperationLoading(true);
      await activitiesApi.remove(id);
      setActivities((prev) => prev.filter((a) => a.id !== id));
      // Also remove from students' activity lists
      setStudents((prev) =>
        prev.map((s) => ({ ...s, activities: s.activities.filter((aid) => aid !== id) })),
      );
    } finally {
      setOperationLoading(false);
    }
  };

  // ── Students ──────────────────────────────────────────────
  const addStudent = async (data: Omit<Student, 'id'>) => {
    try {
      setOperationLoading(true);
      await studentsApi.create(data);
      const [updatedStudents, updatedActivities] = await Promise.all([
        studentsApi.getAll(),
        activitiesApi.getAll(),
      ]);
      setStudents(updatedStudents);
      setActivities(updatedActivities);
    } finally {
      setOperationLoading(false);
    }
  };

  const updateStudent = async (id: string, data: Partial<Student>) => {
    try {
      setOperationLoading(true);
      await studentsApi.update(id, data);
      const [updatedStudents, updatedActivities] = await Promise.all([
        studentsApi.getAll(),
        activitiesApi.getAll(),
      ]);
      setStudents(updatedStudents);
      setActivities(updatedActivities);
    } finally {
      setOperationLoading(false);
    }
  };

  const deleteStudent = async (id: string) => {
    try {
      setOperationLoading(true);
      await studentsApi.remove(id);
      setStudents((prev) => prev.filter((s) => s.id !== id));
      setActivities((prev) =>
        prev.map((a) => ({ ...a, students: a.students.filter((sid) => sid !== id) })),
      );
      setAttendance((prev) => prev.filter((r) => r.studentId !== id));
      setPayments((prev) => prev.filter((p) => p.studentId !== id));
      setAgreements((prev) => prev.filter((ag) => ag.studentId !== id));
    } finally {
      setOperationLoading(false);
    }
  };

  // ── Agreements ────────────────────────────────────────────
  const addAgreement = async (data: Omit<Agreement, 'id'>) => {
    try {
      setOperationLoading(true);
      const newAgreement = await agreementsApi.create(data);
      setAgreements((prev) => [...prev, newAgreement]);
    } finally {
      setOperationLoading(false);
    }
  };

  const updateAgreement = async (id: string, data: Partial<Agreement>) => {
    try {
      setOperationLoading(true);
      const updated = await agreementsApi.update(id, data);
      setAgreements((prev) => prev.map((a) => (a.id === id ? updated : a)));
    } finally {
      setOperationLoading(false);
    }
  };

  // ── Attendance ────────────────────────────────────────────
  const addAttendance = async (data: Omit<AttendanceRecord, 'id'>) => {
    try {
      setOperationLoading(true);
      const newRecord = await attendanceApi.create(data);
      setAttendance((prev) => [...prev, newRecord]);
    } finally {
      setOperationLoading(false);
    }
  };

  const updateAttendance = async (id: string, data: Partial<AttendanceRecord>) => {
    try {
      setOperationLoading(true);
      const updated = await attendanceApi.update(id, data);
      setAttendance((prev) => prev.map((r) => (r.id === id ? updated : r)));
    } finally {
      setOperationLoading(false);
    }
  };

  // ── Payments ──────────────────────────────────────────────
  const addPayment = async (data: Omit<Payment, 'id'>) => {
    try {
      setOperationLoading(true);
      const newPayment = await paymentsApi.create(data);
      setPayments((prev) => [...prev, newPayment]);
    } finally {
      setOperationLoading(false);
    }
  };

  const updatePayment = async (id: string, data: Partial<Payment>) => {
    try {
      setOperationLoading(true);
      const updated = await paymentsApi.update(id, data);
      setPayments((prev) => prev.map((p) => (p.id === id ? updated : p)));
    } finally {
      setOperationLoading(false);
    }
  };

  // ── Teachers ──────────────────────────────────────────────
  const addTeacher = async (data: Omit<Teacher, 'id'>) => {
    try {
      setOperationLoading(true);
      const newTeacher = await teachersApi.create(data);
      setTeachers((prev) => [...prev, newTeacher]);
    } finally {
      setOperationLoading(false);
    }
  };

  const updateTeacher = async (id: string, data: Partial<Teacher>) => {
    try {
      setOperationLoading(true);
      const updated = await teachersApi.update(id, data);
      setTeachers((prev) => prev.map((t) => (t.id === id ? updated : t)));
    } finally {
      setOperationLoading(false);
    }
  };

  const deleteTeacher = async (id: string) => {
    try {
      setOperationLoading(true);
      await teachersApi.remove(id);
      setTeachers((prev) => prev.filter((t) => t.id !== id));
      setActivities((prev) =>
        prev.map((a) => ({ ...a, teachers: a.teachers.filter((tid) => tid !== id) })),
      );
    } finally {
      setOperationLoading(false);
    }
  };

  // ── Appointments ──────────────────────────────────────
  const addAppointment = async (data: Omit<Appointment, 'id'>) => {
    try {
      setOperationLoading(true);
      const newAppointment = await appointmentsApi.create(data);
      setAppointments((prev) => [...prev, newAppointment]);
    } finally {
      setOperationLoading(false);
    }
  };

  const updateAppointment = async (id: string, data: Partial<Appointment>) => {
    try {
      setOperationLoading(true);
      const updated = await appointmentsApi.update(id, data);
      setAppointments((prev) => prev.map((a) => (a.id === id ? updated : a)));
    } finally {
      setOperationLoading(false);
    }
  };

  const deleteAppointment = async (id: string) => {
    try {
      setOperationLoading(true);
      await appointmentsApi.remove(id);
      setAppointments((prev) => prev.filter((a) => a.id !== id));
    } finally {
      setOperationLoading(false);
    }
  };

  const value: DataContextType = {
    activities,
    students,
    agreements,
    attendance,
    payments,
    teachers,
    appointments,
    loading,
    operationLoading,
    error,
    refreshAll: fetchAll,
    addActivity,
    updateActivity,
    deleteActivity,
    addStudent,
    updateStudent,
    deleteStudent,
    addAgreement,
    updateAgreement,
    addAttendance,
    updateAttendance,
    addPayment,
    updatePayment,
    addTeacher,
    updateTeacher,
    deleteTeacher,
    addAppointment,
    updateAppointment,
    deleteAppointment,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};
