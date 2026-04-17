import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Parent } from '../../parents/entities/parent.entity';
import { Teacher } from '../../teachers/entities/teacher.entity';

export enum AppointmentStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  COMPLETED = 'completed',
}

@Entity('appointments')
export class Appointment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'parent_id' })
  parentId: string;

  @ManyToOne(() => Parent, (parent) => parent.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'parent_id' })
  parent: Parent;

  @Column({ name: 'teacher_id' })
  teacherId: string;

  @ManyToOne(() => Teacher, (teacher) => teacher.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'teacher_id' })
  teacher: Teacher;

  @Column({ type: 'date' })
  date: string;

  @Column({ type: 'time' })
  time: string;

  @Column({
    type: 'enum',
    enum: AppointmentStatus,
    default: AppointmentStatus.PENDING,
  })
  status: AppointmentStatus;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
