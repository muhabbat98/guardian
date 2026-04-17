import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Activity } from '../../activities/entities/activity.entity';
import { AttendanceRecord } from '../../attendance/entities/attendance.entity';
import { Payment } from '../../payments/entities/payment.entity';
import { Agreement } from '../../agreements/entities/agreement.entity';
import { Parent } from '../../parents/entities/parent.entity';

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

  @Column({ name: 'parent_id', nullable: true })
  parentId: string;

  @ManyToOne(() => Parent, (parent) => parent.children, { nullable: true })
  @JoinColumn({ name: 'parent_id' })
  parent: Parent;

  @Column({ nullable: true, type: 'text' })
  address: string;

  @Column({ name: 'enrollment_date' })
  enrollmentDate: string;

  @Column({ name: 'user_id', nullable: true, unique: true })
  userId: string;

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
