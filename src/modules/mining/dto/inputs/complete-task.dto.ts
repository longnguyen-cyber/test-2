import { IsNotEmpty, IsUUID } from 'class-validator';

export class CompleteTaskRequestDto {
  @IsNotEmpty()
  @IsUUID()
  userHabitId!: string;

  @IsNotEmpty()
  @IsUUID()
  taskId!: string;
}
