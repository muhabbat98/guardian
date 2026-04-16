import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
import { AgreementStatus } from '../entities/agreement.entity';

export class CreateAgreementDto {
  @IsString()
  @IsNotEmpty()
  studentId: string;

  @IsString()
  @IsNotEmpty()
  agreementDate: string;

  @IsString()
  @IsNotEmpty()
  startDate: string;

  @IsString()
  @IsNotEmpty()
  endDate: string;

  @IsString()
  @IsNotEmpty()
  terms: string;

  @IsString()
  @IsNotEmpty()
  signedBy: string;

  @IsOptional()
  @IsEnum(AgreementStatus)
  status?: AgreementStatus;
}
