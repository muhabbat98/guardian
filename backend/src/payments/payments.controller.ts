import {
  Controller, Get, Post, Put, Delete,
  Param, Body, Query, HttpCode, HttpStatus,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Get()
  findAll(@Query('studentId') studentId?: string) {
    return this.paymentsService.findAll(studentId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.paymentsService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreatePaymentDto) {
    return this.paymentsService.create(dto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdatePaymentDto) {
    return this.paymentsService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.paymentsService.remove(id);
  }
}
