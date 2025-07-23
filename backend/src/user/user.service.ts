import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, User } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.UserCreateInput): Promise<User> {
    const existing = await this.prisma.user.findUnique({ where: { username: data.username } });
    if (existing) {
      throw new ConflictException('Username already exists');
    }
    return this.prisma.user.create({ data });
  }

  findAll(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  findOne(id: number): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  /**
   * @brief Updates user data with optional password hashing
   * @description Updates user information and hashes password if provided
   * @param {number} id - User ID to update
   * @param {Prisma.UserUpdateInput} data - User data to update
   * @returns {Promise<User>} Updated user object
   */
  async update(id: number, data: Prisma.UserUpdateInput): Promise<User> {
    // Hash password if it's being updated
    if (data.password && typeof data.password === 'string') {
      data.password = await bcrypt.hash(data.password, 10);
    }

    return this.prisma.user.update({ where: { id }, data });
  }

  remove(id: number): Promise<User> {
    return this.prisma.user.delete({ where: { id } });
  }
}
