import { IsString, IsNotEmpty, IsOptional, IsNumber, IsArray } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateActivityDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  time: string;

  @IsString()
  @IsNotEmpty()
  dayOfWeek: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  capacity?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  teachers?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  students?: string[];
}
