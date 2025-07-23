import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Expense } from '@prisma/client';

@Injectable()
export class ExpenseService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.ExpenseCreateInput): Promise<Expense> {
    return this.prisma.expense.create({ data });
  }

  findAll(): Promise<Expense[]> {
    return this.prisma.expense.findMany();
  }

  findOne(id: number): Promise<Expense | null> {
    return this.prisma.expense.findUnique({ where: { id } });
  }

  update(id: number, data: Prisma.ExpenseUpdateInput): Promise<Expense> {
    return this.prisma.expense.update({ where: { id }, data });
  }

  remove(id: number): Promise<Expense> {
    return this.prisma.expense.delete({ where: { id } });
  }
}
