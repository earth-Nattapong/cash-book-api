import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Inject,
} from '@nestjs/common';
import type { IUserService } from './user.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiPaginatedResponse,
  ApiResponse,
  ResponseFactory,
} from '../../common/dto';
import { UserResponseDto } from './dto/user-response.dto';
import { UserSearchRequest } from './dto/user-search-request.dto';

@Controller('users')
export class UserController {
  constructor(
    @Inject('IUserService') private readonly userService: IUserService,
  ) {}

  @Post()
  async create(
    @Body() createUserDto: CreateUserDto,
  ): Promise<ApiResponse<UserResponseDto>> {
    const user = await this.userService.create(createUserDto);

    return ResponseFactory.success(user);
  }

  @Get()
  async findAll(
    @Body() searchDto: UserSearchRequest,
  ): Promise<ApiPaginatedResponse<UserResponseDto>> {
    const users = await this.userService.findAll(searchDto);

    return ResponseFactory.paginated(
      users.data,
      users.meta,
      'Users retrieved successfully',
    );
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
  ): Promise<ApiResponse<UserResponseDto>> {
    const user = await this.userService.findOne(id);

    return ResponseFactory.success(user);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<ApiResponse<UserResponseDto>> {
    const user = await this.userService.update(id, updateUserDto);

    return ResponseFactory.success(user);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<ApiResponse<UserResponseDto>> {
    const user = await this.userService.remove(id);

    return ResponseFactory.success(user);
  }
}
