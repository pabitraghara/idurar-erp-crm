import {
  IsNotEmpty,
  IsEmail,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class ContactInfo {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  company?: string;
}

export class WebhookDto {
  @IsNotEmpty()
  @IsString()
  source: string;

  @IsNotEmpty()
  @IsString()
  event: string;

  @ValidateNested()
  @Type(() => ContactInfo)
  contact: ContactInfo;

  @IsOptional()
  @IsString()
  message?: string;

  @IsOptional()
  data?: any;
}
