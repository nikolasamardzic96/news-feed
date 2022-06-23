import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export type SourceDocument = Source & Document;

@Schema()
export class Source {
  @Prop({ required: true, unique: true, default: uuidv4 })
  staticId: string;

  @Prop({ required: true, type: String, index: true })
  url: string;

  @Prop({ required: false, type: Date, default: new Date(-1) })
  lastRead?: Date;

  @Prop({ required: false, Type: Boolean, default: true })
  enabled?: boolean;
}

export const SourceSchema = SchemaFactory.createForClass(Source);
