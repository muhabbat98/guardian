import { IsString, IsOptional, IsNumber, IsArray } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateActivityDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  time?: string;

  @IsOptional()
  @IsString()
  dayOfWeek?: string;

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
