import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export type NewsDocument = News & Document;

@Schema()
export class News {
  @Prop({ required: true, unique: true, default: uuidv4 })
  staticId: string;

  @Prop({ required: false, unique: true })
  url: string;

  @Prop({ required: true, unique: true })
  title: string;

  @Prop({ required: false, unique: true })
  content: string;

  @Prop({ required: true, unique: true })
  pubDate: Date;
}

export const NewsSchema = SchemaFactory.createForClass(News);
