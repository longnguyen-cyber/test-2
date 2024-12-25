import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../../common/authz';
import { CurrentConsumer, CurrentConsumerInfo } from '../../common/decorator';
import { CompleteTaskRequestDto } from './dto';
import { CompleteTaskCommand, UnCompleteTaskCommand, UploadTaskCommand } from './command';

@Controller('tasks')
@ApiTags('tasks')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class TaskController {
  constructor(private readonly queryBus: QueryBus, private readonly commandBus: CommandBus) {}

  @Post('complete')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Complete a Task',
    type: CompleteTaskRequestDto,
  })
  async completeTask(
    @CurrentConsumer() consumer: CurrentConsumerInfo,
    @Body() data: CompleteTaskRequestDto,
  ): Promise<void> {
    return this.commandBus.execute(new CompleteTaskCommand(consumer.id, data));
  }

  @Delete('delete/:id')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'uncomplete a Task',
  })
  async unCompleteTask(
    @CurrentConsumer() consumer: CurrentConsumerInfo,
    @Param('id', ParseUUIDPipe) taskId: string,
  ): Promise<void> {
    return this.commandBus.execute(new UnCompleteTaskCommand(consumer.id, taskId));
  }

  @Post('upload')
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Upload a Task',
  })
  async uploadTask(
    @CurrentConsumer() consumer: CurrentConsumerInfo,
    @Body() data: any,
  ): Promise<void> {
    return this.commandBus.execute(new UploadTaskCommand(consumer.id, data));
  }
}
