import {
  Injectable,
  BadRequestException,
  ConflictException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { DatabaseService } from '../../infra/database';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { IUserRepository } from './user.interface';
import { UserDetail } from './user.entity';
import { Prisma } from '@prisma/client';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(data: CreateUserDto): Promise<UserDetail | null> {
    try {
      const user = await this.databaseService.database.users.create({
        data,
      });
      return user;
    } catch (error) {
      this.handleDatabaseError(error, 'create user');
    }
  }

  async findAll(
    search?: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<{ users: UserDetail[]; total: number }> {
    try {
      const skip = (page - 1) * limit;
      const take = Math.min(limit, 100);

      const whereCondition: Prisma.usersWhereInput = {};

      if (search) {
        whereCondition.OR = [
          { email: { contains: search } },
          { name: { contains: search } },
        ];
      }

      const [users, total] = await Promise.all([
        this.databaseService.database.users.findMany({
          where: whereCondition,
          skip,
          take,
          orderBy: [{ createdAt: 'desc' }],
        }),
        this.databaseService.database.users.count({ where: whereCondition }),
      ]);

      return { users, total };
    } catch (error) {
      this.handleDatabaseError(error, 'findAll users');
    }
  }

  async findOne(id: string): Promise<UserDetail | null> {
    try {
      const user = await this.databaseService.database.users.findUnique({
        where: { id },
      });
      return user;
    } catch (error) {
      this.handleDatabaseError(error, 'findOne user');
    }
  }

  async update(id: string, data: UpdateUserDto): Promise<UserDetail> {
    try {
      const user = await this.databaseService.database.users.update({
        where: { id },
        data,
      });
      return user;
    } catch (error) {
      this.handleDatabaseError(error, 'update user');
    }
  }

  async remove(id: string): Promise<UserDetail> {
    try {
      const user = await this.databaseService.database.users.delete({
        where: { id },
      });
      return user;
    } catch (error) {
      this.handleDatabaseError(error, 'remove user');
    }
  }

  private handleDatabaseError(error: any, operation: string): never {
    console.error(`Database error during ${operation}:`, error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
        case 'P2000':
          throw new BadRequestException(
            'The provided value for the column is too long',
          );
        case 'P2002':
          throw new ConflictException(
            'Unique constraint failed - Duplicate record',
          );
        case 'P2003':
          throw new BadRequestException(
            'Foreign key constraint failed - Related record not found',
          );
        case 'P2025':
          throw new NotFoundException('Record not found');
      }
    }

    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new InternalServerErrorException(errorMessage);
  }
}
