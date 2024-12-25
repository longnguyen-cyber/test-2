import { Exclude, Expose, Type } from 'class-transformer';
import { HabitResDto, HistoryResDto } from '../../../topic/dto';

@Exclude()
export class UserHabitResDto {
  @Expose()
  startDate?: Date;

  @Expose()
  endDate?: Date;

  @Expose()
  @Type(() => HabitResDto)
  habit!: HabitResDto;
}

@Exclude()
export class UserHabitListResDto {
  @Expose()
  today?: Date;

  @Expose()
  @Type(() => UserHabitResDto)
  data: UserHabitResDto[] = [];

  @Expose()
  @Type(() => HistoryResDto)
  histories?: HistoryResDto[] = [];
}
