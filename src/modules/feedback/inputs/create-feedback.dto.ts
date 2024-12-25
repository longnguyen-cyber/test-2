import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateFeedback {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Name of the feedback',
    type: String,
  })
  name!: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Content of the feedback',
    type: String,
  })
  content!: string;
}
