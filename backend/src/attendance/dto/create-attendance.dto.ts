import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
import { AttendanceStatus } from '../entities/attendance.entity';

export class CreateAttendanceDto {
  @IsString()
  @IsNotEmpty()
  studentId: string;

  @IsString()
  @IsNotEmpty()
  activityId: string;

  @IsString()
  @IsNotEmpty()
  date: string;

  @IsEnum(AttendanceStatus)
  status: AttendanceStatus;

  @IsOptional()
  @IsString()
  notes?: string;
}
