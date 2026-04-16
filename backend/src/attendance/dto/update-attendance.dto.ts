import { IsString, IsOptional, IsEnum } from 'class-validator';
import { AttendanceStatus } from '../entities/attendance.entity';

export class UpdateAttendanceDto {
  @IsOptional()
  @IsString()
  date?: string;

  @IsOptional()
  @IsEnum(AttendanceStatus)
  status?: AttendanceStatus;

  @IsOptional()
  @IsString()
  notes?: string;
}
