import { IsString, IsNotEmpty, IsOptional, IsEnum, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { PaymentMethod, PaymentStatus } from '../entities/payment.entity';

export class CreatePaymentDto {
  @IsString()
  @IsNotEmpty()
  studentId: string;

  @IsNumber()
  @Type(() => Number)
  amount: number;

  @IsOptional()
  @IsString()
  date?: string;

  @IsEnum(PaymentMethod)
  method: PaymentMethod;

  @IsEnum(PaymentStatus)
  status: PaymentStatus;

  @IsString()
  @IsNotEmpty()
  dueDate: string;

  @IsOptional()
  @IsString()
  description?: string;
}
