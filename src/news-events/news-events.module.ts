import { Module } from '@nestjs/common';
import { NewsEventsService } from './news-events.service';

@Module({
  imports: [],
  controllers: [],
  providers: [NewsEventsService],
  exports: [NewsEventsService],
})
export class NewsEventsModule {}
