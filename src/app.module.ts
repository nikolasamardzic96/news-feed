import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { NewsModule } from './news/news.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongooseModule.forRoot(
      `${process.env.DATABASE}://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.MONGO_DOCKER_PORT}/${process.env.DB_NAME}?authSource=${process.env.AUTH_SOURCE}`,
    ),
    NewsModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
