import { Exclude, Expose, Type } from 'class-transformer';

@Exclude()
class BaseResDto {
  @Expose()
  id!: string;

  @Expose()
  name!: string;

  @Expose()
  icon?: string;

  @Expose()
  description?: string;
}

@Exclude()
class HistoryResDto {
  @Expose()
  id!: string;
}

@Exclude()
class TaskResDto extends BaseResDto {
  @Expose()
  @Type(() => HistoryResDto)
  history?: HistoryResDto;

  @Expose()
  @Type(() => Boolean)
  isCompleted!: boolean;
}

@Exclude()
export class HabitResDto extends BaseResDto {
  @Expose()
  @Type(() => Number)
  days!: number;

  @Expose()
  @Type(() => Number)
  exp!: number;

  @Expose()
  @Type(() => Number)
  rating?: number;

  @Expose()
  @Type(() => TaskResDto)
  tasks?: TaskResDto[];
}

@Exclude()
class TopicResDto extends BaseResDto {
  @Expose()
  @Type(() => HabitResDto)
  habits!: HabitResDto[];
}

@Exclude()
export class TopicListResDto {
  @Expose()
  @Type(() => TopicResDto)
  data: TopicResDto[] = [];
}
