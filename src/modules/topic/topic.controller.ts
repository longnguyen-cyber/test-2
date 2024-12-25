import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiResponse } from '@nestjs/swagger';
import { LangCode } from 'src/common/constant';
import { LangCodeInfo, LanguageCodeDecorator } from 'src/common/decorator';
import { TopicListResDto } from './dto';
import { GetTopicListQuery } from './queries';

@Controller('topics')
// @UseGuards(AuthGuard)
// @ApiBearerAuth()
export class TopicController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get Topic list',
    type: TopicListResDto,
  })
  async getTopicList(@LanguageCodeDecorator() lang: LangCodeInfo): Promise<TopicListResDto> {
    const data = await this.queryBus.execute(new GetTopicListQuery(lang.lang as LangCode));

    return data;
  }
}
