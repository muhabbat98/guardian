import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { UserRole } from '../entities/user.entity';

export class SignupDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsEnum(UserRole)
  role: UserRole;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  /** Required when role=TEACHER (unless linking via teacherId) */
  @IsOptional()
  @IsString()
  phone?: string;

  /** Required when role=TEACHER (unless linking via teacherId) */
  @IsOptional()
  @IsString()
  specialization?: string;

  /** Optional: link sign-up to an existing Teacher profile (role=TEACHER only) */
  @IsOptional()
  @IsString()
  teacherId?: string;

  /** Optional: link sign-up to an existing Student profile (role=STUDENT only) */
  @IsOptional()
  @IsString()
  studentId?: string;

  /** Optional address (used for PARENT profile) */
  @IsOptional()
  @IsString()
  address?: string;
}
