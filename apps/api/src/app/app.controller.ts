import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';

import { Message, ResponseWithData } from '@toothless/api-interfaces';
import { FormDataRequest } from 'nestjs-form-data';

import { AppService } from './app.service';
import { CreateUserDto } from './dto/crudUserDto';
import { FormDataTestDto } from './dto/formDataTestDto';
import { GetUserQueryDTO } from './dto/getUserQueryDto';
import { UserDocument } from './user.schema';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('users')
  getData(@Query() query: GetUserQueryDTO) {
    const { minSalary, maxSalary, offset, limit, sort } = query;
    return this.appService.getUsers(
      minSalary,
      maxSalary,
      offset,
      limit || 30,
      sort.trim()
    );
  }

  @Post('/users/:id')
  @HttpCode(200)
  createUser(
    @Body() body: CreateUserDto,
    @Param('id') id: string
  ): Promise<Message> {
    return this.appService.createUser({ id, ...body }).then(() => {
      return { message: `${body.name} user created!` };
    });
  }

  @Patch('/users/:id')
  @HttpCode(200)
  updateUser(
    @Body() body: CreateUserDto,
    @Param('id') id: string
  ): Promise<Message> {
    return this.appService.createUser({ id, ...body }).then(() => {
      return { message: `${body.name} user created!` };
    });
  }

  @Get('/users/:id')
  @HttpCode(200)
  getUser(@Param('id') id: string): Promise<ResponseWithData<UserDocument>> {
    return this.appService.getUser(id).then((user) => {
      return { message: 'User is retrieved', data: user };
    });
  }

  @Delete('/users/:id')
  @HttpCode(200)
  deletUser(@Param('id') id: string): Promise<Message> {
    return this.appService.deleteUser(id).then(() => {
      return { message: 'User is deleted' };
    });
  }

  @Post('users/upload')
  @HttpCode(200)
  @FormDataRequest()
  uploadUsers(@Body() body: FormDataTestDto): Promise<Message> {
    return this.appService.uploadUser(body.file.path).then((count) => {
      return { message: `${count} users created!` };
    });
  }
}
