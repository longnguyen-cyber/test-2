import { IsNotEmpty, IsUUID } from 'class-validator';

export class CompleteTaskRequestDto {
  @IsNotEmpty()
  @IsUUID()
  habitId!: string;

  @IsNotEmpty()
  @IsUUID()
  taskId!: string;
}
