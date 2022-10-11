import { IsNumber, IsOptional, ValidateIf } from 'class-validator';
import { Type } from 'class-transformer';
import { HttpException, HttpStatus } from '@nestjs/common';

export class GetUserQueryDTO {
  @Type(() => Number)
  @IsNumber()
  readonly minSalary: number;

  @Type(() => Number)
  @IsNumber()
  readonly maxSalary: number;

  @Type(() => Number)
  @IsNumber()
  readonly offset: number;

  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  readonly limit?: number;

  @ValidateIf((obj) => {
    const key = obj.sort.trim().replace('-', '');
    const allowedKeys = ['id', 'name', 'login', 'salary'];
    const isValid = allowedKeys.some((e) => e === key);

    if (!isValid)
      throw new HttpException(
        'Invalid sort key is provided',
        HttpStatus.BAD_REQUEST
      );

    return isValid;
  })
  readonly sort: string;
}
