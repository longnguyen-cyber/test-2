import { IsBoolean, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

export class CreateHabitRequestDto {
  @IsNotEmpty()
  @IsUUID()
  habitId!: string;

  @IsOptional()
  @IsBoolean()
  isStart?: boolean;

  @IsOptional()
  startDate?: Date;

  @IsOptional()
  endDate?: Date;
}
