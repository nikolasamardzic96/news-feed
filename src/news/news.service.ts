import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { INews } from './interfaces/news.interface';
import { News, NewsDocument } from './schemas/news.schema.entity';

@Injectable()
export class NewsService {
  private readonly logger = new Logger(NewsService.name);

  public constructor(
    @InjectModel(News.name) private readonly newsModel: Model<NewsDocument>,
  ) {}

  public async insertNews(news: INews[]) {
    try {
      // insert many documents,
      // but ignores duplicates,
      // and proceeds to insert other non-duplicates
      await this.newsModel.insertMany(news, { ordered: false });
    } catch (error) {
      this.logger.warn(`not inserting duplicates`);
    }
  }
}
