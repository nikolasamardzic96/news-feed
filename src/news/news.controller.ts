import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Sse,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { SourcesService } from '../sources/sources.service';
import { NewsEventsService } from '../news-events/news-events.service';
import { RegexRequest } from './requests/regex.request';
import { newsRegex } from '../common/constants';
import { currentNewsRegex } from '../common/utils';

@Controller('news')
export class NewsController {
  constructor(
    private readonly newsEventService: NewsEventsService,
    private readonly sourcesService: SourcesService,
  ) {}

  @Sse('')
  streamEvents(): Observable<MessageEvent> {
    return this.newsEventService.subscribe();
  }

  @Post('/add-regex')
  public async addRegex(@Body() regexRequest: RegexRequest) {
    const { regex } = regexRequest;
    newsRegex.push(new RegExp(regex));
    await this.sourcesService.resetSourcesLastDate();
    return currentNewsRegex();
  }

  @Get('/regex')
  public getRegex() {
    return currentNewsRegex();
  }

  @Post('/remove-regex/:index')
  public async removeRegex(@Param('index', ParseIntPipe) index: number) {
    newsRegex.splice(index, 1);
    await this.sourcesService.resetSourcesLastDate();
    return currentNewsRegex();
  }
}
