import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class StartMiningDto {
  @IsNotEmpty()
  @IsNumber()
  startDate!: number;

  @IsNotEmpty()
  @IsNumber()
  endDate!: number;

  @IsNotEmpty()
  @IsNumber()
  point!: number;

  @IsNotEmpty()
  @IsBoolean()
  isDone!: boolean;

  @IsNotEmpty()
  @IsNumber()
  boost!: number;

  @IsNotEmpty()
  @IsBoolean()
  isClaimed!: boolean;

  @IsNotEmpty()
  @IsString()
  deviceId!: string;
}
