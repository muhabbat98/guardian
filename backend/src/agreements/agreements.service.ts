import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Agreement, AgreementStatus } from './entities/agreement.entity';
import { CreateAgreementDto } from './dto/create-agreement.dto';
import { UpdateAgreementDto } from './dto/update-agreement.dto';

@Injectable()
export class AgreementsService {
  constructor(
    @InjectRepository(Agreement)
    private agreementsRepo: Repository<Agreement>,
  ) {}

  private toResponse(agreement: Agreement) {
    return {
      id: agreement.id,
      studentId: agreement.studentId,
      agreementDate: agreement.agreementDate,
      startDate: agreement.startDate,
      endDate: agreement.endDate,
      terms: agreement.terms,
      signedBy: agreement.signedBy,
      status: agreement.status,
    };
  }

  async findAll(studentId?: string) {
    const where: any = {};
    if (studentId) where.studentId = studentId;
    const agreements = await this.agreementsRepo.find({
      where,
      order: { createdAt: 'DESC' },
    });
    return agreements.map(this.toResponse.bind(this));
  }

  async findOne(id: string) {
    const agreement = await this.agreementsRepo.findOneBy({ id });
    if (!agreement) throw new NotFoundException(`Agreement #${id} not found`);
    return this.toResponse(agreement);
  }

  async create(dto: CreateAgreementDto) {
    const agreement = this.agreementsRepo.create({
      studentId: dto.studentId,
      agreementDate: dto.agreementDate,
      startDate: dto.startDate,
      endDate: dto.endDate,
      terms: dto.terms,
      signedBy: dto.signedBy,
      status: dto.status ?? AgreementStatus.ACTIVE,
    });
    const saved = await this.agreementsRepo.save(agreement);
    return this.toResponse(saved);
  }

  async update(id: string, dto: UpdateAgreementDto) {
    const agreement = await this.agreementsRepo.findOneBy({ id });
    if (!agreement) throw new NotFoundException(`Agreement #${id} not found`);
    Object.assign(agreement, dto);
    const saved = await this.agreementsRepo.save(agreement);
    return this.toResponse(saved);
  }

  async remove(id: string) {
    const agreement = await this.agreementsRepo.findOneBy({ id });
    if (!agreement) throw new NotFoundException(`Agreement #${id} not found`);
    await this.agreementsRepo.remove(agreement);
  }
}
