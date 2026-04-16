import { Injectable, OnApplicationBootstrap, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Teacher } from '../teachers/entities/teacher.entity';
import { Activity } from '../activities/entities/activity.entity';
import { Student } from '../students/entities/student.entity';
import { AttendanceRecord, AttendanceStatus } from '../attendance/entities/attendance.entity';
import { Payment, PaymentMethod, PaymentStatus } from '../payments/entities/payment.entity';
import { Agreement, AgreementStatus } from '../agreements/entities/agreement.entity';

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(Teacher) private teachersRepo: Repository<Teacher>,
    @InjectRepository(Activity) private activitiesRepo: Repository<Activity>,
    @InjectRepository(Student) private studentsRepo: Repository<Student>,
    @InjectRepository(AttendanceRecord) private attendanceRepo: Repository<AttendanceRecord>,
    @InjectRepository(Payment) private paymentsRepo: Repository<Payment>,
    @InjectRepository(Agreement) private agreementsRepo: Repository<Agreement>,
  ) {}

  async onApplicationBootstrap() {
    const teacherCount = await this.teachersRepo.count();
    if (teacherCount > 0) {
      this.logger.log('Database already seeded — skipping.');
      return;
    }

    this.logger.log('Seeding database with sample data...');

    // Seed Teachers
    const teachers = await this.teachersRepo.save([
      { firstName: 'Sarah', lastName: 'Johnson', email: 'sarah.j@guardian.edu', phone: '+998901234567', specialization: 'Arts & Crafts' },
      { firstName: 'Michael', lastName: 'Chen', email: 'michael.c@guardian.edu', phone: '+998901234568', specialization: 'Sports' },
      { firstName: 'Emily', lastName: 'Rodriguez', email: 'emily.r@guardian.edu', phone: '+998901234569', specialization: 'Music' },
    ]);

    // Seed Students (without activities first)
    const students = await this.studentsRepo.save([
      { firstName: 'Alex', lastName: 'Williams', dateOfBirth: '2015-05-12', guardianName: 'Jennifer Williams', guardianPhone: '+998901111111', guardianEmail: 'j.williams@example.com', address: 'Tashkent, Yunusabad District', enrollmentDate: '2024-09-01' },
      { firstName: 'Emma', lastName: 'Davis', dateOfBirth: '2014-08-22', guardianName: 'Robert Davis', guardianPhone: '+998901111112', guardianEmail: 'r.davis@example.com', address: 'Tashkent, Mirabad District', enrollmentDate: '2024-09-01' },
      { firstName: 'Noah', lastName: 'Martinez', dateOfBirth: '2016-03-15', guardianName: 'Maria Martinez', guardianPhone: '+998901111113', guardianEmail: 'm.martinez@example.com', address: 'Tashkent, Shaykhantaur District', enrollmentDate: '2024-09-05' },
      { firstName: 'Sophia', lastName: 'Anderson', dateOfBirth: '2015-11-30', guardianName: 'James Anderson', guardianPhone: '+998901111114', guardianEmail: 'j.anderson@example.com', address: 'Tashkent, Chilanzar District', enrollmentDate: '2024-09-10' },
    ]);

    // Seed Activities with relations
    const artsCrafts = await this.activitiesRepo.save({
      name: 'Arts & Crafts',
      time: '14:00 - 15:30',
      dayOfWeek: 'Monday, Wednesday',
      description: 'Creative arts and hands-on craft projects',
      capacity: 15,
      teachers: [teachers[0]],
      students: [students[0], students[1], students[2]],
    });

    const soccer = await this.activitiesRepo.save({
      name: 'Soccer Practice',
      time: '16:00 - 17:30',
      dayOfWeek: 'Tuesday, Thursday',
      description: 'Team sports and physical fitness',
      capacity: 20,
      teachers: [teachers[1]],
      students: [students[1], students[3]],
    });

    const music = await this.activitiesRepo.save({
      name: 'Music Lessons',
      time: '15:00 - 16:00',
      dayOfWeek: 'Friday',
      description: 'Learn instruments and music theory',
      capacity: 12,
      teachers: [teachers[2]],
      students: [students[0], students[2]],
    });

    // Seed Attendance
    await this.attendanceRepo.save([
      { studentId: students[0].id, activityId: artsCrafts.id, date: '2026-03-10', status: AttendanceStatus.PRESENT },
      { studentId: students[1].id, activityId: artsCrafts.id, date: '2026-03-10', status: AttendanceStatus.PRESENT },
      { studentId: students[2].id, activityId: artsCrafts.id, date: '2026-03-10', status: AttendanceStatus.ABSENT, notes: 'Sick' },
      { studentId: students[1].id, activityId: soccer.id, date: '2026-03-11', status: AttendanceStatus.PRESENT },
      { studentId: students[3].id, activityId: soccer.id, date: '2026-03-11', status: AttendanceStatus.EXCUSED, notes: 'Family event' },
    ]);

    // Seed Payments
    await this.paymentsRepo.save([
      { studentId: students[0].id, amount: 500000, date: '2026-03-01', method: PaymentMethod.TRANSFER, status: PaymentStatus.PAID, dueDate: '2026-03-01', description: 'March 2026 tuition' },
      { studentId: students[1].id, amount: 500000, date: '2026-03-05', method: PaymentMethod.CASH, status: PaymentStatus.PAID, dueDate: '2026-03-01', description: 'March 2026 tuition' },
      { studentId: students[2].id, amount: 500000, date: '', method: PaymentMethod.CASH, status: PaymentStatus.PENDING, dueDate: '2026-03-15', description: 'March 2026 tuition' },
      { studentId: students[3].id, amount: 500000, date: '', method: PaymentMethod.CARD, status: PaymentStatus.OVERDUE, dueDate: '2026-03-01', description: 'March 2026 tuition' },
    ]);

    // Seed Agreements
    await this.agreementsRepo.save([
      { studentId: students[0].id, agreementDate: '2024-08-25', startDate: '2024-09-01', endDate: '2025-06-30', terms: 'Standard afterschool program agreement covering all enrolled activities.', signedBy: 'Jennifer Williams', status: AgreementStatus.ACTIVE },
      { studentId: students[1].id, agreementDate: '2024-08-25', startDate: '2024-09-01', endDate: '2025-06-30', terms: 'Standard afterschool program agreement covering all enrolled activities.', signedBy: 'Robert Davis', status: AgreementStatus.ACTIVE },
    ]);

    this.logger.log('Database seeded successfully!');
  }
}
