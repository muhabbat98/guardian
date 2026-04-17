import {
  Controller, Get, Post, Put, Delete,
  Param, Body, Query, HttpCode, HttpStatus, UseGuards, Req,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../auth/entities/user.entity';

@Controller('payments')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Get()
  @Roles(UserRole.STUDENT, UserRole.TEACHER, UserRole.PARENT, UserRole.ADMIN)
  findAll(@Query('studentId') studentId?: string) {
    return this.paymentsService.findAll(studentId);
  }

  @Get(':id')
  @Roles(UserRole.STUDENT, UserRole.TEACHER, UserRole.PARENT, UserRole.ADMIN)
  findOne(@Param('id') id: string) {
    return this.paymentsService.findOne(id);
  }

  @Post()
  @Roles(UserRole.ADMIN, UserRole.PARENT)
  create(@Body() dto: CreatePaymentDto) {
    return this.paymentsService.create(dto);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN, UserRole.PARENT)
  update(@Param('id') id: string, @Body() dto: UpdatePaymentDto) {
    return this.paymentsService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.paymentsService.remove(id);
  }
}
