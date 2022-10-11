import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';

import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { FileSystemStoredFile, NestjsFormDataModule } from 'nestjs-form-data';
import { User, UserSchema } from './user.schema';

@Module({
  imports: [
    DatabaseModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    NestjsFormDataModule.config({
      storage: FileSystemStoredFile, // using FileStorage because in memory will be not best for large files
      fileSystemStoragePath: './apps/api/tmp',
      limits: {
        files: 1,
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
