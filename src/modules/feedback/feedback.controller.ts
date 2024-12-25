import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/common/authz';
import { CreateFeedbackCommand } from './command';
import { CurrentConsumer, CurrentConsumerInfo } from 'src/common/decorator';
import { CreateFeedback } from './inputs/create-feedback.dto';
import { GetFeedbackQuery, GetFeedbacksQuery } from './quereies';

@Controller('feedback')
@ApiTags('feedback')
export class FeedbackController {
  constructor(private readonly queryBus: QueryBus, private readonly commandBus: CommandBus) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Create Feedback',
  })
  async createFeedback(
    @CurrentConsumer() consumer: CurrentConsumerInfo,
    @Body() body: CreateFeedback,
  ) {
    return this.commandBus.execute(new CreateFeedbackCommand(body, consumer.id));
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get Feedbacks',
  })
  async getFeedbacks(@CurrentConsumer() consumer: CurrentConsumerInfo) {
    return this.queryBus.execute(new GetFeedbacksQuery(consumer.id));
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get Feedback',
  })
  async getFeedback(@CurrentConsumer() consumer: CurrentConsumerInfo, @Param('id') id: string) {
    return this.queryBus.execute(new GetFeedbackQuery(id, consumer.id));
  }
}
