import { Controller, Get, Post, Body, Param, Delete, Req, Put, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags, ApiOperation, ApiParam, ApiBody, ApiResponse } from '@nestjs/swagger';
import {
  ForbiddenException,
  UnauthorizedException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import * as bcrypt from 'bcryptjs';

interface AuthenticatedUser {
  userId: number;
  username: string;
}

interface AuthenticatedRequest {
  user: AuthenticatedUser;
}

/**
 * @brief Controller for managing user operations
 * @description Handles CRUD operations for users with authentication
 */
@ApiTags('users')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * @brief Creates a new user
   * @description Creates a new user with the provided data
   * @param {CreateUserDto} createUserDto - The user data to create
   * @returns {Promise<User>} Promise that resolves to the created user
   */
  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 201, description: 'User created successfully.' })
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.userService.create(createUserDto);
    const { password: _password, ...result } = user;
    return result;
  }

  /**
   * @brief Retrieves all users
   * @description Returns a list of all users in the system
   * @returns {Promise<User[]>} Promise that resolves to an array of users
   */
  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'Users retrieved successfully.' })
  async findAll() {
    const users = await this.userService.findAll();
    return users.map(({ password: _password, ...user }) => user);
  }

  /**
   * @brief Retrieves the current user's profile
   * @description Returns the profile information of the authenticated user
   * @param {AuthenticatedRequest} req - Express request object containing user information
   * @returns {Promise<User>} Promise that resolves to the user profile
   */
  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'User profile retrieved successfully.' })
  async getProfile(@Req() req: AuthenticatedRequest) {
    if (!req.user || !req.user.userId) {
      throw new UnauthorizedException('User not authenticated');
    }
    const userId = req.user.userId;
    const user = await this.userService.findOne(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const { password: _password, ...result } = user;
    return result;
  }

  /**
   * @brief Update the current user's profile
   * @description Updates username and/or password for the authenticated user
   * @param {AuthenticatedRequest} req - Express request object containing user data
   * @param {UpdateUserDto} dto - Update data containing username and/or password
   * @returns {Object} Updated user profile without password
   */
  @ApiOperation({ summary: 'Update current user profile' })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({ status: 200, description: 'Profile updated successfully.' })
  @Put('me')
  @UseGuards(JwtAuthGuard)
  async updateProfile(@Req() req: AuthenticatedRequest, @Body() dto: UpdateUserDto) {
    if (!req.user || !req.user.userId) {
      throw new UnauthorizedException('User not authenticated');
    }
    const userId = req.user.userId;

    // If password is being updated, validate current password
    if (dto.password) {
      const currentUser = await this.userService.findOne(userId);
      if (!currentUser) {
        throw new NotFoundException('User not found');
      }

      // Check if current password is provided and valid
      if (!dto.currentPassword) {
        throw new BadRequestException('Current password is required to change password');
      }

      const isCurrentPasswordValid = await bcrypt.compare(
        dto.currentPassword,
        currentUser.password,
      );
      if (!isCurrentPasswordValid) {
        throw new BadRequestException('Current password is incorrect');
      }
    }

    // Remove currentPassword from update data as it's not a database field
    const { currentPassword: _currentPassword, ...updateData } = dto;

    const user = await this.userService.update(userId, updateData);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const { password: _password, ...result } = user;
    return result;
  }

  /**
   * @brief Update user by ID
   * @description Updates a user's information by ID (admin function)
   * @param {string} id - User ID to update
   * @param {UpdateUserDto} dto - Update data
   * @param {AuthenticatedRequest} req - Request object containing user info
   * @returns {Object} Updated user profile without password
   */
  @ApiOperation({ summary: 'Update user by ID' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({ status: 200, description: 'User updated successfully.' })
  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
    @Req() req: AuthenticatedRequest,
  ) {
    if (req.user.userId !== Number(id)) {
      throw new ForbiddenException('You can only update your own profile');
    }
    const user = await this.userService.update(Number(id), dto);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const { password: _password, ...result } = user;
    return result;
  }

  /**
   * @brief Delete user by ID
   * @description Deletes a user by ID (admin function)
   * @param {string} id - User ID to delete
   * @param {AuthenticatedRequest} req - Request object containing user info
   * @returns {Object} Deleted user profile without password
   */
  @ApiOperation({ summary: 'Delete user by ID' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'User deleted successfully.' })
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    if (req.user.userId !== Number(id)) {
      throw new ForbiddenException('You can only delete your own profile');
    }
    const user = await this.userService.remove(Number(id));
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const { password: _password, ...result } = user;
    return result;
  }
}
