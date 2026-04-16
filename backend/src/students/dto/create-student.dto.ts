import { IsString, IsNotEmpty, IsEmail, IsOptional, IsArray } from 'class-validator';

export class CreateStudentDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsNotEmpty()
  dateOfBirth: string;

  @IsString()
  @IsNotEmpty()
  guardianName: string;

  @IsString()
  @IsNotEmpty()
  guardianPhone: string;

  @IsEmail()
  @IsNotEmpty()
  guardianEmail: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsString()
  @IsNotEmpty()
  enrollmentDate: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  activities?: string[];
}
