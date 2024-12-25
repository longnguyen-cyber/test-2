import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../../common/authz';
import {
  CreateHabitRequestDto,
  ProfileDetailResDto,
  UpdateProfileRequestDto,
  UserHabitListResDto,
} from './dto';
import {
  CurrentConsumer,
  CurrentConsumerInfo,
  LangCodeInfo,
  LanguageCodeDecorator,
} from '../../common/decorator';
import { GetProfileDetailQuery, GetTaskProgressQuery, GetUserHabitQuery } from './queries';
import {
  CreateUserHabitCommand,
  DeleteUserHabitCommand,
  UpdateProfileCommand,
  UpdateUserHabitCommand,
} from './command';
import { UploadUserHabitCommand } from './command/upload-user-habit';
import { I18n, I18nContext } from 'nestjs-i18n';
import * as dayjs from 'dayjs';

@Controller('users')
@ApiTags('users')
export class UserController {
  constructor(private readonly queryBus: QueryBus, private readonly commandBus: CommandBus) {}

  @Get('profile')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get User Profile',
    type: ProfileDetailResDto,
  })
  async getProfile(@CurrentConsumer() consumer: CurrentConsumerInfo): Promise<ProfileDetailResDto> {
    return this.queryBus.execute(new GetProfileDetailQuery(consumer.id));
  }

  @Put('profile')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Update User Profile',
  })
  async updateUserProfile(
    @CurrentConsumer() consumer: CurrentConsumerInfo,
    @Body() data: UpdateProfileRequestDto,
  ): Promise<void> {
    return this.commandBus.execute(new UpdateProfileCommand(consumer.id, data));
  }

  @Get('habits')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get List User Habit',
    type: UserHabitListResDto,
  })
  async getHabits(
    @LanguageCodeDecorator() lang: LangCodeInfo,
    @CurrentConsumer() consumer: CurrentConsumerInfo,
  ): Promise<UserHabitListResDto> {
    const data = await this.queryBus.execute(new GetUserHabitQuery(consumer.id, lang.lang));

    // const translateData = data.data.map((item: any) => {
    //   return {
    //     ...item,
    //     habit: {
    //       ...item.habit,
    //       name: i18n.translate(`habit.${item.habit.icon}`),
    //       tasks: item.habit.tasks.map((task: any) => {
    //         return {
    //           ...task,
    //           name: i18n.translate(`task.${task.icon}`),
    //         };
    //       }),
    //     },
    //   };
    // });

    return data;
  }

  @Post('habits')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Add User Habit',
    type: CreateHabitRequestDto,
  })
  async addUserHabit(
    @CurrentConsumer() consumer: CurrentConsumerInfo,
    @Body() data: CreateHabitRequestDto,
  ): Promise<void> {
    return this.commandBus.execute(new CreateUserHabitCommand(consumer.id, data));
  }
  @Post('habits/upload')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Add User Habit',
    type: CreateHabitRequestDto,
  })
  async uploadHabit(
    @CurrentConsumer() consumer: CurrentConsumerInfo,
    @Body() data: CreateHabitRequestDto[],
  ): Promise<void> {
    return this.commandBus.execute(new UploadUserHabitCommand(consumer.id, data));
  }

  @Put('habits/:id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Edit User Habit',
  })
  async editUserHabit(
    @CurrentConsumer() consumer: CurrentConsumerInfo,
    @Param('id', ParseUUIDPipe) habitId: string,
  ): Promise<void> {
    try {
      const data = await this.commandBus.execute(new UpdateUserHabitCommand(consumer.id, habitId));
      return data;
    } catch (error) {
      console.log('error', error);
    }
  }

  @Delete('habits/:id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'remove User Habit',
  })
  async deleteUserhabit(
    @CurrentConsumer() consumer: CurrentConsumerInfo,
    @Param('id', ParseUUIDPipe) habitId: string,
  ): Promise<void> {
    return this.commandBus.execute(new DeleteUserHabitCommand(consumer.id, habitId));
  }

  @Get('habits/progress')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Check User Progress',
  })
  async checkProgress(@CurrentConsumer() consumer: CurrentConsumerInfo): Promise<any> {
    return this.queryBus.execute(new GetTaskProgressQuery(consumer.id));
  }
}
