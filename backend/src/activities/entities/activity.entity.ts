import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Teacher } from '../../teachers/entities/teacher.entity';
import { Student } from '../../students/entities/student.entity';
import { AttendanceRecord } from '../../attendance/entities/attendance.entity';

@Entity('activities')
export class Activity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  time: string;

  @Column({ name: 'day_of_week' })
  dayOfWeek: string;

  @Column({ nullable: true, type: 'text' })
  description: string;

  @Column({ nullable: true, type: 'text' })
  createdByUserId: string;

  @Column({ nullable: true, type: 'int' })
  capacity: number;

  @ManyToMany(() => Teacher, (teacher) => teacher.activities)
  @JoinTable({
    name: 'activity_teachers',
    joinColumn: { name: 'activity_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'teacher_id', referencedColumnName: 'id' },
  })
  teachers: Teacher[];

  @ManyToMany(() => Student, (student) => student.activities)
  @JoinTable({
    name: 'activity_students',
    joinColumn: { name: 'activity_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'student_id', referencedColumnName: 'id' },
  })
  students: Student[];

  @OneToMany(() => AttendanceRecord, (record) => record.activity)
  attendanceRecords: AttendanceRecord[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
