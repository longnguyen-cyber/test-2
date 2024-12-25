import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AddReferral {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Referral code',
    type: String,
  })
  referralCode!: string;
}
