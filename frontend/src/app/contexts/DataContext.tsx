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

interface DataContextType {
  activities: Activity[];
  students: Student[];
  agreements: Agreement[];
  attendance: AttendanceRecord[];
  payments: Payment[];
  teachers: Teacher[];
  loading: boolean;
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      ] = await Promise.all([
        activitiesApi.getAll(),
        studentsApi.getAll(),
        teachersApi.getAll(),
        attendanceApi.getAll(),
        paymentsApi.getAll(),
        agreementsApi.getAll(),
      ]);
      setActivities(activitiesData);
      setStudents(studentsData);
      setTeachers(teachersData);
      setAttendance(attendanceData);
      setPayments(paymentsData);
      setAgreements(agreementsData);
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
    await activitiesApi.create(data);
    const updated = await activitiesApi.getAll();
    setActivities(updated);
  };

  const updateActivity = async (id: string, data: Partial<Activity>) => {
    await activitiesApi.update(id, data);
    const updated = await activitiesApi.getAll();
    setActivities(updated);
  };

  const deleteActivity = async (id: string) => {
    await activitiesApi.remove(id);
    setActivities((prev) => prev.filter((a) => a.id !== id));
    // Also remove from students' activity lists
    setStudents((prev) =>
      prev.map((s) => ({ ...s, activities: s.activities.filter((aid) => aid !== id) })),
    );
  };

  // ── Students ──────────────────────────────────────────────
  const addStudent = async (data: Omit<Student, 'id'>) => {
    await studentsApi.create(data);
    const [updatedStudents, updatedActivities] = await Promise.all([
      studentsApi.getAll(),
      activitiesApi.getAll(),
    ]);
    setStudents(updatedStudents);
    setActivities(updatedActivities);
  };

  const updateStudent = async (id: string, data: Partial<Student>) => {
    await studentsApi.update(id, data);
    const [updatedStudents, updatedActivities] = await Promise.all([
      studentsApi.getAll(),
      activitiesApi.getAll(),
    ]);
    setStudents(updatedStudents);
    setActivities(updatedActivities);
  };

  const deleteStudent = async (id: string) => {
    await studentsApi.remove(id);
    setStudents((prev) => prev.filter((s) => s.id !== id));
    setActivities((prev) =>
      prev.map((a) => ({ ...a, students: a.students.filter((sid) => sid !== id) })),
    );
    setAttendance((prev) => prev.filter((r) => r.studentId !== id));
    setPayments((prev) => prev.filter((p) => p.studentId !== id));
    setAgreements((prev) => prev.filter((ag) => ag.studentId !== id));
  };

  // ── Agreements ────────────────────────────────────────────
  const addAgreement = async (data: Omit<Agreement, 'id'>) => {
    const newAgreement = await agreementsApi.create(data);
    setAgreements((prev) => [...prev, newAgreement]);
  };

  const updateAgreement = async (id: string, data: Partial<Agreement>) => {
    const updated = await agreementsApi.update(id, data);
    setAgreements((prev) => prev.map((a) => (a.id === id ? updated : a)));
  };

  // ── Attendance ────────────────────────────────────────────
  const addAttendance = async (data: Omit<AttendanceRecord, 'id'>) => {
    const newRecord = await attendanceApi.create(data);
    setAttendance((prev) => [...prev, newRecord]);
  };

  const updateAttendance = async (id: string, data: Partial<AttendanceRecord>) => {
    const updated = await attendanceApi.update(id, data);
    setAttendance((prev) => prev.map((r) => (r.id === id ? updated : r)));
  };

  // ── Payments ──────────────────────────────────────────────
  const addPayment = async (data: Omit<Payment, 'id'>) => {
    const newPayment = await paymentsApi.create(data);
    setPayments((prev) => [...prev, newPayment]);
  };

  const updatePayment = async (id: string, data: Partial<Payment>) => {
    const updated = await paymentsApi.update(id, data);
    setPayments((prev) => prev.map((p) => (p.id === id ? updated : p)));
  };

  // ── Teachers ──────────────────────────────────────────────
  const addTeacher = async (data: Omit<Teacher, 'id'>) => {
    const newTeacher = await teachersApi.create(data);
    setTeachers((prev) => [...prev, newTeacher]);
  };

  const updateTeacher = async (id: string, data: Partial<Teacher>) => {
    const updated = await teachersApi.update(id, data);
    setTeachers((prev) => prev.map((t) => (t.id === id ? updated : t)));
  };

  const deleteTeacher = async (id: string) => {
    await teachersApi.remove(id);
    setTeachers((prev) => prev.filter((t) => t.id !== id));
    setActivities((prev) =>
      prev.map((a) => ({ ...a, teachers: a.teachers.filter((tid) => tid !== id) })),
    );
  };

  const value: DataContextType = {
    activities,
    students,
    agreements,
    attendance,
    payments,
    teachers,
    loading,
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
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};
