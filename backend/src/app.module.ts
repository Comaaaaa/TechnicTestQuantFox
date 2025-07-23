import { Module } from '@nestjs/common';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { ExpenseController } from './expense/expense.controller';
import { ExpenseService } from './expense/expense.service';
import { UserModule } from './user/user.module';
import { ExpenseModule } from './expense/expense.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [UserModule, ExpenseModule, PrismaModule, AuthModule],
  controllers: [UserController, ExpenseController],
  providers: [UserService, ExpenseService],
})
export class AppModule {}
