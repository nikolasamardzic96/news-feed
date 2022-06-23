import { Injectable } from '@nestjs/common';
import { fromEvent, Observable } from 'rxjs';
import { EventEmitter } from 'events';
import { NewsEventsInterface } from './interfaces/news-events.interface';

@Injectable()
export class NewsEventsService {
  private readonly emitter = new EventEmitter();

  subscribe(): Observable<MessageEvent> {
    return fromEvent(this.emitter, 'incoming.news') as Observable<MessageEvent>;
  }

  async emit(data: NewsEventsInterface) {
    this.emitter.emit('incoming.news', { data });
  }
}
