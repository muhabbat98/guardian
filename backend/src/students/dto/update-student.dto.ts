import { IsString, IsEmail, IsOptional, IsArray } from 'class-validator';

export class UpdateStudentDto {
  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsString()
  dateOfBirth?: string;

  @IsOptional()
  @IsString()
  guardianName?: string;

  @IsOptional()
  @IsString()
  guardianPhone?: string;

  @IsOptional()
  @IsEmail()
  guardianEmail?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  enrollmentDate?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  activities?: string[];
}
