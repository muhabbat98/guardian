import { IsString, IsNotEmpty, IsOptional, IsArray } from 'class-validator';

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

  /** UUID of the parent record */
  @IsOptional()
  @IsString()
  parentId?: string;

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
