import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ISource } from './interfaces/source.interface';
import { SourceRequest } from './requests/source.request';
import { Source, SourceDocument } from './schemas/source.schema.entity';
import { AxiosResponse } from 'axios';
import { HttpService } from '@nestjs/axios';
import { map, lastValueFrom } from 'rxjs';
import { validationRegex } from '../common/constants';

@Injectable()
export class SourcesService {
  private readonly logger = new Logger(SourcesService.name);

  public constructor(
    @InjectModel(Source.name) private sourceModel: Model<SourceDocument>,
    private readonly httpService: HttpService,
  ) {}

  public async findAllSources(): Promise<ISource[]> {
    try {
      const sources = await this.sourceModel.find();
      return sources;
    } catch (error) {
      this.logger.error(`Error getting info from database`, error);
      throw new Error(`Could not find sources!`);
    }
  }

  public async findEnabledSources(): Promise<ISource[]> {
    try {
      const sources = await this.sourceModel.find({ enabled: true });
      return sources;
    } catch (error) {
      this.logger.error(`Error getting info from database`, error);
      throw new Error(`Could not find sources!`);
    }
  }

  public async insertSource(source: SourceRequest): Promise<ISource> {
    try {
      const checkValid = await this.checkIfValidRss(source.url);
      if (!checkValid) {
        this.logger.error(`Provided url is not valid rss feed`);
        return;
      }

      const existingSource = await this.sourceModel.findOne({
        url: source.url,
      });

      if (existingSource) {
        this.logger.warn(`Provided source already exists`);
        return;
      }

      return this.sourceModel.create(source);
    } catch (error) {
      this.logger.error(`Error inserting info`, error);
      throw new Error(`Could not insert source!`);
    }
  }

  public async updateSourceLastDate(
    staticId: string,
    lastRead: Date,
  ): Promise<void> {
    try {
      await this.sourceModel.updateOne({ staticId }, { lastRead });
    } catch (error) {
      this.logger.error(`Error updating info`, error);
      throw new Error(`Could not update sources!`);
    }
  }

  public async toggleSourceEnabled(staticId: string): Promise<void> {
    try {
      const source = await this.sourceModel.findOne({ staticId });
      if (!source) {
        this.logger.error(`Provided source doesn't exist`);
        return;
      }
      await this.sourceModel.updateOne(
        { staticId },
        { enabled: !source.enabled },
      );
    } catch (error) {
      this.logger.error(`Couldn't not toggle source`, error);
      throw new HttpException(
        `error while toggling ${staticId}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async resetSourcesLastDate(): Promise<void> {
    try {
      await this.sourceModel.updateMany({}, { lastRead: new Date(-1) });
    } catch (error) {
      this.logger.error(`Could not update sources`, error);
    }
  }

  private async checkIfValidRss(url: string): Promise<boolean> {
    try {
      const response = this.httpService.get(url).pipe(
        map((axiosResponse: AxiosResponse) => {
          return axiosResponse.headers['content-type'];
        }),
      );
      const contentType = await lastValueFrom(response);
      if (contentType.match(validationRegex)) return true;
      return false;
    } catch (error) {
      this.logger.error(`Couldn't send request to provided url`, error);
      throw new HttpException(
        `error while validating ${url}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
