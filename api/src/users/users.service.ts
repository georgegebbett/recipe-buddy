import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import axios from 'axios';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async setup(createUserDto: CreateUserDto): Promise<User> {
    if ((await this.findAll()).length === 0) {
      const createdUser = new this.userModel(createUserDto);
      return createdUser.save();
    }
    throw new HttpException('User already set up', HttpStatus.FORBIDDEN);
  }

  async isSetup(): Promise<object> {
    const isSetup = (await this.userModel.find({}).exec()).length !== 0;
    return Promise.resolve({
      isSetup: isSetup,
    });
  }

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

  async findOneById(id: string): Promise<User | undefined> {
    return this.userModel.findOne({ _id: id }).exec();
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

  async findOneByIdAndUpdate(id: string, updateUserDto: UpdateUserDto) {
    const grocyUrl = updateUserDto.grocyBaseUrl.endsWith('/')
      ? updateUserDto.grocyBaseUrl.slice(0, -1)
      : updateUserDto.grocyBaseUrl;
    try {
      const { data } = await axios.get(`${grocyUrl}/api/system/info`, {
        headers: {
          'GROCY-API-KEY': updateUserDto.grocyApiKey,
        },
      });
      this.logger.log(data);
    } catch (e) {
      this.logger.log(e);
      throw new HttpException(
        'Incorrect Grocy Credentials',
        HttpStatus.UNAUTHORIZED,
      );
    }

    return this.userModel.findByIdAndUpdate(id, {
      $set: {
        grocyBaseUrl: grocyUrl,
        grocyApiKey: updateUserDto.grocyApiKey,
      },
    });
  }
}
