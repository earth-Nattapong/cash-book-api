import { Injectable, NotFoundException } from '@nestjs/common';
import { Logger } from '../../infra/logger';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from './user.repository';
import { IUserService } from './user.interface';
import { UserResponseDto } from './dto/user-response.dto';
import { UserSearchRequest } from './dto/user-search-request.dto';
import { PaginatedResponse } from '../../common/dto';

@Injectable()
export class UserService implements IUserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly logger: Logger,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    this.logger.log('Creating new user', { email: createUserDto.email });

    const user = await this.userRepository.create(createUserDto);

    if (!user) {
      this.logger.warn('User not created', { email: createUserDto.email });
      throw new NotFoundException(
        `User with email ${createUserDto.email} not found`,
      );
    }

    this.logger.log('User created successfully', { userId: user.id });

    return new UserResponseDto(user);
  }

  async findAll(
    searchDto: UserSearchRequest,
  ): Promise<PaginatedResponse<UserResponseDto>> {
    this.logger.debug('Fetching all users', { searchDto });

    const { search } = searchDto.context;
    const { page = 1, limit = 10 } = searchDto.pagination;

    const users = await this.userRepository.findAll(search, page, limit);

    const userResponseDtos = users.users.map(
      (user) => new UserResponseDto(user),
    );

    this.logger.debug(`Found ${userResponseDtos.length} users`);

    return new PaginatedResponse(userResponseDtos, page, limit, users.total);
  }

  async findOne(id: string) {
    this.logger.debug('Fetching user by id', { userId: id });
    const user = await this.userRepository.findOne(id);

    if (!user) {
      this.logger.warn('User not found', { userId: id });
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    this.logger.debug('User found', { userId: id });
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    this.logger.log('Updating user', { userId: id, updates: updateUserDto });
    await this.findOne(id);
    const user = await this.userRepository.update(id, updateUserDto);
    this.logger.log('User updated successfully', { userId: id });
    return user;
  }

  async remove(id: string) {
    this.logger.log('Removing user', { userId: id });
    await this.findOne(id);
    const user = await this.userRepository.remove(id);
    this.logger.log('User removed successfully', { userId: id });
    return user;
  }
}
