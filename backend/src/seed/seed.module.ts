import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../auth/entities/user.entity';
import { Teacher } from '../teachers/entities/teacher.entity';
import { Activity } from '../activities/entities/activity.entity';
import { Student } from '../students/entities/student.entity';
import { Parent } from '../parents/entities/parent.entity';
import { AttendanceRecord } from '../attendance/entities/attendance.entity';
import { Payment } from '../payments/entities/payment.entity';
import { Agreement } from '../agreements/entities/agreement.entity';
import { SeedService } from './seed.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User, Parent, Teacher, Activity, Student, AttendanceRecord, Payment, Agreement,
    ]),
  ],
  providers: [SeedService],
})
export class SeedModule {}
