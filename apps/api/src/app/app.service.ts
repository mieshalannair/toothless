import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { validate } from 'class-validator';

import csvToJson from 'csvtojson';
import { ClientSession, Model } from 'mongoose';
import { UserDto } from './dto/userDto';
import { User, UserDocument } from './user.schema';

@Injectable()
export class AppService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  private options = {
    upsert: true,
    new: true,
    setDefaultsOnInsert: true,
  };

  async createUser(userData: UserDto) {
    try {
      const user = new this.userModel(userData);
      await user.save();
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async updateUser(userData: UserDto) {
    try {
      const { id, login, name, salary } = userData;
      const user = await this.userModel.findOne({ id });
      user.login = login;
      user.salary = salary;
      user.name = name;
      await user.save();
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getUser(id: string) {
    try {
      const user = await this.userModel.findOne(
        { id },
        { _id: 0, id: 1, login: 1, name: 1, salary: 1 }
      );

      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      return user;
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async deleteUser(id: string) {
    try {
      return this.userModel.deleteOne({ id });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /* 
    Get user with pagination capabilities
    @params minSalary - Minumum Salary
    @params maxSalary - Minumum Salary
    @params offset - page number, example :2 and the  limit is 10 the query will skip 20 records
    @params limit - limit n records to be returned
    @params sort - `+${fieldName}` where `+` means ascending, `-` means descending
   */
  async getUsers(
    minSalary: number,
    maxSalary: number,
    offset: number,
    limit: number,
    sort: string
  ) {
    const users = await this.userModel
      .find(
        {
          salary: {
            $gte: minSalary,
            $lte: maxSalary,
          },
        },
        {
          _id: 0,
          __v: 0,
        },
        {
          skip: offset * limit,
          limit,
        }
      )
      .sort(`${sort}`);

    const total = await this.userModel.countDocuments();

    return {
      total,
      users,
    };
  }

  async uploadUser(path: string): Promise<number> {
    let session: ClientSession;
    const json = await csvToJson().fromFile(path);

    if (!json.length) {
      throw new HttpException(
        'Uploaded file has should have at least one row',
        HttpStatus.BAD_REQUEST
      );
    }

    try {
      session = await this.userModel.startSession();
      await session.withTransaction(async () => {
        const promise = json.map(async (e) => {
          const user = new UserDto();
          Object.assign(user, { ...e, salary: Number(e.salary) });
          const validationError = await validate(user);

          if (validationError.length) {
            throw new HttpException(
              'Validation failed',
              HttpStatus.BAD_REQUEST
            );
          }

          await this.userModel
            .findOneAndUpdate(
              { id: e.id },
              {
                id: e.id,
                login: e.login,
                name: e.name,
                salary: e.salary,
              },
              this.options
            )
            .session(session);
        });

        await Promise.all(promise);
        await this.commitWithRetry(session);
      });
    } catch (error) {
      await session.abortTransaction();

      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    session.endSession();

    return json.length;
  }

  async commitWithRetry(session: ClientSession) {
    try {
      await session.commitTransaction();
      console.log('Transaction committed.');
    } catch (error) {
      if (error.hasErrorLabel('UnknownTransactionCommitResult')) {
        console.log(
          'UnknownTransactionCommitResult, retrying commit operation ...'
        );
        await this.commitWithRetry(session);
      } else {
        console.log('Error during commit ...');
        throw error;
      }
    }
  }
}
