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

export enum AgreementStatus {
  ACTIVE = 'active',
  EXPIRED = 'expired',
  PENDING = 'pending',
}

@Entity('agreements')
export class Agreement {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Student, (student) => student.agreements, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'student_id' })
  student: Student;

  @Column({ name: 'student_id' })
  studentId: string;

  @Column({ name: 'agreement_date' })
  agreementDate: string;

  @Column({ name: 'start_date' })
  startDate: string;

  @Column({ name: 'end_date' })
  endDate: string;

  @Column({ type: 'text' })
  terms: string;

  @Column({ name: 'signed_by' })
  signedBy: string;

  @Column({
    type: 'enum',
    enum: AgreementStatus,
    default: AgreementStatus.PENDING,
  })
  status: AgreementStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
