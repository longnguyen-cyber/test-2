import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class CreatedHabitResDto {
  @Expose()
  id!: string;

  @Expose()
  name!: string;
}
