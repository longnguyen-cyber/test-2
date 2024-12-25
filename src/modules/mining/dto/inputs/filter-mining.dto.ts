import { ApiProperty, ApiTags } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class FilterMiningDto {
  @IsNumber()
  @IsOptional()
  @ApiProperty({
    description: 'Page number',
    type: Number,
    default: 1,
  })
  @Type(() => Number)
  page: number = 1;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    description: 'Limit number',
    type: Number,
    default: 10,
  })
  @Type(() => Number)
  limit: number = 10;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Sort by',
    type: String,
    default: 'createdAt',
  })
  @Type(() => String)
  sortBy: string = 'createdAt';

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Sort direction',
    type: String,
    default: 'ASC',
  })
  @Type(() => String)
  sortDir: string = 'ASC';
}
