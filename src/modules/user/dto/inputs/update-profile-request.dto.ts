import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Gender } from 'src/common/constant';

export class UpdateProfileRequestDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  wallet?: string;

  @IsOptional()
  @IsString()
  avatar?: string;

  @IsOptional()
  @IsString()
  referBy?: string;

  @IsOptional()
  @IsString()
  gender?: Gender;

  @IsOptional()
  @IsNumber()
  old?: number;

  @IsOptional()
  @IsNumber()
  height?: number;

  @IsOptional()
  @IsNumber()
  weight?: number;
}
