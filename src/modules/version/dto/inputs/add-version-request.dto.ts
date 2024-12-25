import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AddVersionRequestDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: String, example: '1.1' })
  version!: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: String, example: 'android' })
  platform!: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: String, example: 'http://example.com' })
  url!: string;
}
