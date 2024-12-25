import { IsOptional, IsString, MaxLength } from 'class-validator';

export class GetProfileDetailQueryDto {
  @IsOptional()
  @MaxLength(150)
  @IsString()
  clinicName?: string;
}
