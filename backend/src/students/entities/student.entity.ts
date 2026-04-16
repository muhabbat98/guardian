import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Activity } from '../../activities/entities/activity.entity';
import { AttendanceRecord } from '../../attendance/entities/attendance.entity';
import { Payment } from '../../payments/entities/payment.entity';
import { Agreement } from '../../agreements/entities/agreement.entity';

@Entity('students')
export class Student {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ name: 'date_of_birth' })
  dateOfBirth: string;

  @Column({ name: 'guardian_name' })
  guardianName: string;

  @Column({ name: 'guardian_phone' })
  guardianPhone: string;

  @Column({ name: 'guardian_email' })
  guardianEmail: string;

  @Column({ nullable: true, type: 'text' })
  address: string;

  @Column({ name: 'enrollment_date' })
  enrollmentDate: string;

  @ManyToMany(() => Activity, (activity) => activity.students)
  activities: Activity[];

  @OneToMany(() => AttendanceRecord, (record) => record.student)
  attendanceRecords: AttendanceRecord[];

  @OneToMany(() => Payment, (payment) => payment.student)
  payments: Payment[];

  @OneToMany(() => Agreement, (agreement) => agreement.student)
  agreements: Agreement[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
