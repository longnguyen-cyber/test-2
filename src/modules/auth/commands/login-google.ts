import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import * as firebase from 'firebase-admin';
import { User } from 'src/domain/entities';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as referralCodes from 'referral-codes';
import { LoginGoogleRequestDto, LoginResDto } from '../dto';
import { SeimBadRequestException } from '../../../common/exception';

export class LoginGoogleCommand {
  constructor(public readonly data: LoginGoogleRequestDto) {}
}

@CommandHandler(LoginGoogleCommand)
export class LoginGoogleCommandHandler implements ICommandHandler<LoginGoogleCommand> {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async execute(command: LoginGoogleCommand): Promise<LoginResDto> {
    try {
      const { data } = command;
      let isNewUser = false;

      const authUser = await firebase
        .auth()
        .verifyIdToken(data.token)
        .catch((error) => {
          throw new SeimBadRequestException(error.message);
        });
      if (!authUser) {
        throw new SeimBadRequestException('Login fail');
      }

      let user = await this.userRepo.findOne({
        where: { email: authUser.email },
      });

      if (!user) {
        isNewUser = true;
        user = await this.userRepo.save({
          email: authUser.email,
          name: authUser.name,
          phone: '',
          avatar: authUser.picture,
          wallet: '',
          referBy: '',
          point: 0,
          exp: 0,
          old: 0,
          height: 0,
          weight: 0,
          refererCode: referralCodes.generate({
            length: 8,
          })[0],
        });
      }

      return {
        userId: user.id,
        isNewUser,
        accessToken: await this.jwtService.signAsync(
          {
            id: user.id,
            email: user.email,
            name: user.name,
          },
          {
            expiresIn: '30d',
            secret: process.env.JWT_SECRET,
          },
        ),
      };
    } catch (error) {
      console.error(error);
      throw new SeimBadRequestException('An unexpected error occurred');
    }
  }
}
