import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NewsController } from './news.controller';
import { NewsFeedService } from './news-feed.service';
import { NewsEventsModule } from '../news-events/news-events.module';
import { NewsService } from './news.service';
import { SourceModule } from '../sources/sources.module';
import { News, NewsSchema } from './schemas/news.schema.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: News.name, schema: NewsSchema }]),
    NewsEventsModule,
    SourceModule,
  ],
  controllers: [NewsController],
  providers: [NewsFeedService, NewsService],
})
export class NewsModule {}
