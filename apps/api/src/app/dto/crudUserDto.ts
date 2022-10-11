import { IsNumber, IsPositive, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';
export class CreateUserDto {
  @IsString()
  readonly login: string;

  @IsString()
  readonly name: string;

  @IsNumber()
  @IsPositive()
  @Min(0, { message: 'should be positive number' })
  @Type(() => Number)
  readonly salary: number;
}
