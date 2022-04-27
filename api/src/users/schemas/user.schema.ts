import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Role } from '../role.enum';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: false })
  refresh_token: string;

  @Prop({ required: false })
  roles: Role[];

  @Prop({ required: false })
  grocyBaseUrl: string;

  @Prop({ required: false })
  grocyApiKey: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
