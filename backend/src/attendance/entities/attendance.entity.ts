import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Student } from '../../students/entities/student.entity';
import { Activity } from '../../activities/entities/activity.entity';

export enum AttendanceStatus {
  PRESENT = 'present',
  ABSENT = 'absent',
  EXCUSED = 'excused',
}

@Entity('attendance_records')
export class AttendanceRecord {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Student, (student) => student.attendanceRecords, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'student_id' })
  student: Student;

  @Column({ name: 'student_id' })
  studentId: string;

  @ManyToOne(() => Activity, (activity) => activity.attendanceRecords, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'activity_id' })
  activity: Activity;

  @Column({ name: 'activity_id' })
  activityId: string;

  @Column()
  date: string;

  @Column({
    type: 'enum',
    enum: AttendanceStatus,
    default: AttendanceStatus.PRESENT,
  })
  status: AttendanceStatus;

  @Column({ nullable: true, type: 'text' })
  notes: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
