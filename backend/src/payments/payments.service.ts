import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './entities/payment.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private paymentsRepo: Repository<Payment>,
  ) {}

  private toResponse(payment: Payment) {
    return {
      id: payment.id,
      studentId: payment.studentId,
      amount: Number(payment.amount),
      date: payment.date ?? '',
      method: payment.method,
      status: payment.status,
      dueDate: payment.dueDate,
      description: payment.description ?? undefined,
    };
  }

  async findAll(studentId?: string) {
    const where: any = {};
    if (studentId) where.studentId = studentId;
    const payments = await this.paymentsRepo.find({
      where,
      order: { createdAt: 'DESC' },
    });
    return payments.map(this.toResponse.bind(this));
  }

  async findOne(id: string) {
    const payment = await this.paymentsRepo.findOneBy({ id });
    if (!payment) throw new NotFoundException(`Payment #${id} not found`);
    return this.toResponse(payment);
  }

  async create(dto: CreatePaymentDto) {
    const payment = this.paymentsRepo.create({
      studentId: dto.studentId,
      amount: dto.amount,
      date: dto.date ?? '',
      method: dto.method,
      status: dto.status,
      dueDate: dto.dueDate,
      description: dto.description,
    });
    const saved = await this.paymentsRepo.save(payment);
    return this.toResponse(saved);
  }

  async update(id: string, dto: UpdatePaymentDto) {
    const payment = await this.paymentsRepo.findOneBy({ id });
    if (!payment) throw new NotFoundException(`Payment #${id} not found`);
    Object.assign(payment, dto);
    const saved = await this.paymentsRepo.save(payment);
    return this.toResponse(saved);
  }

  async remove(id: string) {
    const payment = await this.paymentsRepo.findOneBy({ id });
    if (!payment) throw new NotFoundException(`Payment #${id} not found`);
    await this.paymentsRepo.remove(payment);
  }

  async getPendingCount() {
    return this.paymentsRepo.count({
      where: [{ status: 'pending' as any }, { status: 'overdue' as any }],
    });
  }
}
