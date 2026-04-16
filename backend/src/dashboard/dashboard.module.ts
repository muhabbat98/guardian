import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Activity } from '../activities/entities/activity.entity';
import { Student } from '../students/entities/student.entity';
import { Payment } from '../payments/entities/payment.entity';
import { AttendanceRecord } from '../attendance/entities/attendance.entity';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Activity, Student, Payment, AttendanceRecord])],
  providers: [DashboardService],
  controllers: [DashboardController],
})
export class DashboardModule {}
