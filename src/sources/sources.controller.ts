import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ISource } from './interfaces/source.interface';
import { SourceRequest } from './requests/source.request';
import { SourcesService } from './sources.service';

@Controller('sources')
export class SourcesController {
  public constructor(private readonly sourcesService: SourcesService) {}

  @Post()
  public async postSource(@Body() source: SourceRequest): Promise<ISource> {
    return this.sourcesService.insertSource(source);
  }

  @Get()
  public async getSources(): Promise<ISource[]> {
    return this.sourcesService.findAllSources();
  }

  @Get('/enabled')
  public async getEnabledSources(): Promise<ISource[]> {
    return this.sourcesService.findEnabledSources();
  }

  @Post(':id')
  public async toggleSource(@Param('id') id: string) {
    return this.sourcesService.toggleSourceEnabled(id);
  }
}
