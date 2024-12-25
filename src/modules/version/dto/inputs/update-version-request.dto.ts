import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateVersionRequestDto {
  @IsString()
  @ApiProperty({ type: String, example: '1.1' })
  version!: string;

  @IsString()
  @ApiProperty({ type: String, example: 'http://example.com' })
  url!: string;
}
