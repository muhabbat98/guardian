import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Activity } from '../activities/entities/activity.entity';
import { Student } from '../students/entities/student.entity';
import { Payment, PaymentStatus } from '../payments/entities/payment.entity';
import { AttendanceRecord, AttendanceStatus } from '../attendance/entities/attendance.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Activity)
    private activitiesRepo: Repository<Activity>,
    @InjectRepository(Student)
    private studentsRepo: Repository<Student>,
    @InjectRepository(Payment)
    private paymentsRepo: Repository<Payment>,
    @InjectRepository(AttendanceRecord)
    private attendanceRepo: Repository<AttendanceRecord>,
  ) {}

  async getStats() {
    const today = new Date().toISOString().split('T')[0];

    const [totalActivities, totalStudents, pendingPayments, todayAttendance] =
      await Promise.all([
        this.activitiesRepo.count(),
        this.studentsRepo.count(),
        this.paymentsRepo.count({
          where: [
            { status: PaymentStatus.PENDING },
            { status: PaymentStatus.OVERDUE },
          ],
        }),
        this.attendanceRepo.count({
          where: { date: today, status: AttendanceStatus.PRESENT },
        }),
      ]);

    return { totalActivities, totalStudents, pendingPayments, todayAttendance };
  }

  async getAlerts() {
    const overduePayments = await this.paymentsRepo.find({
      where: { status: PaymentStatus.OVERDUE },
      relations: ['student'],
      order: { dueDate: 'ASC' },
      take: 10,
    });

    return overduePayments.map((p) => ({
      id: p.id,
      studentId: p.studentId,
      studentName: p.student
        ? `${p.student.firstName} ${p.student.lastName}`
        : 'Unknown',
      amount: Number(p.amount),
      dueDate: p.dueDate,
      description: p.description,
    }));
  }
}
