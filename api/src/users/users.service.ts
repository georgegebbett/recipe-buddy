import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findOneByUsername(username: string): Promise<User | undefined> {
    return this.userModel.findOne({ username: username }).exec();
  }

  async setRefreshTokenByUsername(
    username: string,
    refresh_token: string,
  ): Promise<User> {
    return this.userModel.findOneAndUpdate(
      { username: username },
      { $set: { refresh_token: refresh_token } },
    );
  }

  async invalidateRefreshTokenByUsername(username: string) {
    return this.userModel.findOneAndUpdate(
      { username: username },
      { $unset: { refresh_token: '' } },
    );
  }
}
