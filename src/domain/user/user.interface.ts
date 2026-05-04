import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDetail } from './user.entity';
import { UserSearchRequest } from './dto/user-search-request.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { PaginatedResponse } from 'src/common/dto';

export interface IUserRepository {
  create(data: CreateUserDto): Promise<UserDetail | null>;
  findAll(
    search?: string,
    page?: number,
    limit?: number,
  ): Promise<{ users: UserDetail[]; total: number }>;
  findOne(id: string): Promise<UserDetail | null>;
  update(id: string, data: UpdateUserDto): Promise<UserDetail | null>;
  remove(id: string): Promise<UserDetail | null>;
}

export interface IUserService {
  create(createUserDto: CreateUserDto): Promise<UserResponseDto>;
  findAll(
    searchDto: UserSearchRequest,
  ): Promise<PaginatedResponse<UserResponseDto>>;
  findOne(id: string): Promise<UserResponseDto>;
  update(id: string, updateUserDto: UpdateUserDto): Promise<UserResponseDto>;
  remove(id: string): Promise<UserResponseDto>;
}
