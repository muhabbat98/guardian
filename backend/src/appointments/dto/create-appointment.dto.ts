import { IsString, IsOptional, IsDateString, IsEnum } from 'class-validator';
import { AppointmentStatus } from '../entities/appointment.entity';

export class CreateAppointmentDto {
  @IsString()
  parentId: string;

  @IsString()
  teacherId: string;

  @IsDateString()
  date: string;

  @IsString()
  time: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
