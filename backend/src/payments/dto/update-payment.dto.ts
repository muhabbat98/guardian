import { IsString, IsOptional, IsEnum, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { PaymentMethod, PaymentStatus } from '../entities/payment.entity';

export class UpdatePaymentDto {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  amount?: number;

  @IsOptional()
  @IsString()
  date?: string;

  @IsOptional()
  @IsEnum(PaymentMethod)
  method?: PaymentMethod;

  @IsOptional()
  @IsEnum(PaymentStatus)
  status?: PaymentStatus;

  @IsOptional()
  @IsString()
  dueDate?: string;

  @IsOptional()
  @IsString()
  description?: string;
}
