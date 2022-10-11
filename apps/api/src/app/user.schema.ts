import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document as Doc } from 'mongoose';

export type UserDocument = User & Doc;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true, index: true })
  id: string;

  @Prop({ required: true, unique: true })
  login: string;

  @Prop({ required: true })
  name: string; // UTF8 is the encoding supported by MongoDB out of the box.

  @Prop({ required: true })
  salary: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.index({ id: 1, type: 1 });
