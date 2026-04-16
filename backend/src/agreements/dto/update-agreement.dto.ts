import { IsString, IsOptional, IsEnum } from 'class-validator';
import { AgreementStatus } from '../entities/agreement.entity';

export class UpdateAgreementDto {
  @IsOptional()
  @IsString()
  agreementDate?: string;

  @IsOptional()
  @IsString()
  startDate?: string;

  @IsOptional()
  @IsString()
  endDate?: string;

  @IsOptional()
  @IsString()
  terms?: string;

  @IsOptional()
  @IsString()
  signedBy?: string;

  @IsOptional()
  @IsEnum(AgreementStatus)
  status?: AgreementStatus;
}
