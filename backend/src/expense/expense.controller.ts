import { Controller, Get, Post, Body, Param, Delete, Req, Put, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBody, ApiResponse } from '@nestjs/swagger';
import { ExpenseService } from './expense.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

interface AuthenticatedUser {
  userId: number;
  username: string;
}

interface AuthenticatedRequest {
  user: AuthenticatedUser;
}

/**
 * @brief Controller for managing expense operations
 * @description Handles CRUD operations for expenses with user authentication
 */
@ApiTags('expenses')
@Controller('expense')
@UseGuards(JwtAuthGuard)
export class ExpenseController {
  constructor(private readonly expenseService: ExpenseService) {}

  /**
   * @brief Creates a new expense
   * @description Creates a new expense for the authenticated user
   * @param {CreateExpenseDto} createExpenseDto - The expense data to create
   * @param {AuthenticatedRequest} req - Express request object containing user information
   * @returns {Promise<Expense>} Promise that resolves to the created expense
   */
  @Post()
  @ApiOperation({ summary: 'Create a new expense' })
  @ApiBody({ type: CreateExpenseDto })
  @ApiResponse({ status: 201, description: 'Expense created successfully.' })
  async create(@Body() createExpenseDto: CreateExpenseDto, @Req() req: AuthenticatedRequest) {
    if (!req.user || !req.user.userId) {
      throw new UnauthorizedException('User not authenticated');
    }
    const userId = req.user.userId;
    return this.expenseService.create({
      ...createExpenseDto,
      user: { connect: { id: userId } },
    });
  }

  /**
   * @brief Retrieves all expenses for the authenticated user
   * @description Returns a list of all expenses belonging to the current user
   * @param {AuthenticatedRequest} req - Express request object containing user information
   * @returns {Promise<Expense[]>} Promise that resolves to an array of expenses
   */
  @Get()
  @ApiOperation({ summary: 'Get all expenses for the user' })
  @ApiResponse({ status: 200, description: 'Expenses retrieved successfully.' })
  async findAll(@Req() req: AuthenticatedRequest) {
    if (!req.user || !req.user.userId) {
      throw new UnauthorizedException('User not authenticated');
    }
    const userId = req.user.userId;
    const allExpenses = await this.expenseService.findAll();
    return allExpenses.filter((exp) => exp.userId === userId);
  }

  /**
   * @brief Retrieves a specific expense by ID
   * @description Returns a single expense if it belongs to the authenticated user
   * @param {string} id - The ID of the expense to retrieve
   * @param {AuthenticatedRequest} req - Express request object containing user information
   * @returns {Promise<Expense>} Promise that resolves to the expense
   */
  @Get(':id')
  @ApiOperation({ summary: 'Get expense by ID' })
  @ApiParam({ name: 'id', description: 'Expense ID' })
  @ApiResponse({ status: 200, description: 'Expense retrieved successfully.' })
  async findOne(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    const userId = req.user.userId;
    const expense = await this.expenseService.findOne(+id);
    if (!expense || expense.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }
    return expense;
  }

  /**
   * @brief Updates an existing expense
   * @description Updates expense data and returns the updated expense
   * @param {string} id - The ID of the expense to update
   * @param {UpdateExpenseDto} updateExpenseDto - The expense data to update
   * @param {AuthenticatedRequest} req - Express request object containing user information
   * @returns {Promise<Expense>} Promise that resolves to the updated expense
   */
  @Put(':id')
  @ApiOperation({ summary: 'Update expense by ID' })
  @ApiParam({ name: 'id', description: 'Expense ID' })
  @ApiBody({ type: UpdateExpenseDto })
  @ApiResponse({ status: 200, description: 'Expense updated successfully.' })
  async update(
    @Param('id') id: string,
    @Body() updateExpenseDto: UpdateExpenseDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const userId = req.user.userId;
    const expense = await this.expenseService.findOne(+id);
    if (!expense || expense.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }
    return this.expenseService.update(+id, updateExpenseDto);
  }

  /**
   * @brief Deletes an existing expense
   * @description Deletes an expense if it belongs to the authenticated user
   * @param {string} id - The ID of the expense to delete
   * @param {AuthenticatedRequest} req - Express request object containing user information
   * @returns {Promise<void>} Promise that resolves when deletion is complete
   */
  @Delete(':id')
  @ApiOperation({ summary: 'Delete expense by ID' })
  @ApiParam({ name: 'id', description: 'Expense ID' })
  @ApiResponse({ status: 200, description: 'Expense deleted successfully.' })
  async remove(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    const userId = req.user.userId;
    const expense = await this.expenseService.findOne(+id);
    if (!expense || expense.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }
    return this.expenseService.remove(+id);
  }
}
