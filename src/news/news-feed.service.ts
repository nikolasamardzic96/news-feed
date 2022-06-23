import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import * as Parser from 'rss-parser';
import { newsRegex } from '../common/constants';
import { SourcesService } from 'src/sources/sources.service';
import { NewsEventsService } from '../news-events/news-events.service';
import { INews } from './interfaces/news.interface';
import { NewsService } from './news.service';

@Injectable()
export class NewsFeedService {
  private readonly logger = new Logger(NewsFeedService.name);
  private parser: Parser;
  public constructor(
    private readonly sourcesService: SourcesService,
    private readonly newsEventsService: NewsEventsService,
    private readonly newsService: NewsService,
  ) {}

  @Cron(CronExpression.EVERY_10_SECONDS)
  private async getNews(): Promise<void> {
    const sources = await this.sourcesService.findEnabledSources();
    const parser = this.getParser();
    sources.forEach(async (source) => {
      await parser
        .parseURL(source.url)
        .then(async (response) => {
          const newsArray: INews[] = [];
          await this.filterNews(source.lastRead, response.items, newsArray);
          await this.sourcesService.updateSourceLastDate(
            source.staticId,
            new Date(response.items[0].isoDate),
          );
          if (newsArray.length) await this.newsService.insertNews(newsArray);
        })
        .catch((error) => {
          this.logger.warn(
            `Could not parse url ${source.url} with error: ` + error,
          );
        });
    });
    this.logger.log('CRON iteration executed');
  }

  private async filterNews(
    lastRead: Date,
    items: any[],
    newsArray: INews[],
  ): Promise<void> {
    for (let i = 0; i < items.length; i++) {
      const { contentEncoded, contentSnippet, link, title, pubDate } = items[i];
      if (lastRead >= new Date(items[i].isoDate)) {
        break;
      }

      //remove html elements from content
      const content =
        contentEncoded && typeof contentEncoded === 'string'
          ? contentEncoded.replace(/<[^>]*>?/gm, '')
          : contentSnippet.replace(/<[^>]*>?/gm, '');

      //if regex is not provided, return all news
      let isMatch = true;

      if (newsRegex.length) isMatch = newsRegex.some((rx) => rx.test(content));

      if (isMatch) {
        const news = {
          content,
          title,
          url: link,
          pubDate: new Date(pubDate),
        };
        console.log(news);
        await this.newsEventsService.emit(news);
        newsArray.push(news);
      }
    }
  }

  private getParser(): Parser {
    if (this.parser) {
      return this.parser;
    }

    this.parser = new Parser({
      customFields: {
        item: [
          ['dc:creator', 'dcCreator'],
          ['content:encoded', 'contentEncoded'],
        ],
      },
    });

    return this.parser;
  }
}
