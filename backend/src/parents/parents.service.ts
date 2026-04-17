import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Parent } from './entities/parent.entity';
import { CreateParentDto } from './dto/create-parent.dto';
import { UpdateParentDto } from './dto/update-parent.dto';

@Injectable()
export class ParentsService {
  constructor(
    @InjectRepository(Parent)
    private parentsRepo: Repository<Parent>,
  ) {}

  private toResponse(parent: Parent) {
    return {
      id: parent.id,
      firstName: parent.firstName,
      lastName: parent.lastName,
      email: parent.email,
      phone: parent.phone,
      address: parent.address ?? undefined,
      userId: parent.userId ?? undefined,
      children: (parent.children ?? []).map((s) => s.id),
    };
  }

  async findAll() {
    const parents = await this.parentsRepo.find({ relations: ['children'] });
    return parents.map(this.toResponse.bind(this));
  }

  async findOne(id: string) {
    const parent = await this.parentsRepo.findOne({
      where: { id },
      relations: ['children'],
    });
    if (!parent) throw new NotFoundException(`Parent #${id} not found`);
    return this.toResponse(parent);
  }

  async create(dto: CreateParentDto) {
    const existing = await this.parentsRepo.findOneBy({ email: dto.email });
    if (existing) throw new ConflictException(`Email ${dto.email} already in use`);
    const parent = await this.parentsRepo.save(this.parentsRepo.create(dto));
    return this.findOne(parent.id);
  }

  async update(id: string, dto: UpdateParentDto) {
    const parent = await this.parentsRepo.findOneBy({ id });
    if (!parent) throw new NotFoundException(`Parent #${id} not found`);
    if (dto.email && dto.email !== parent.email) {
      const existing = await this.parentsRepo.findOneBy({ email: dto.email });
      if (existing) throw new ConflictException(`Email ${dto.email} already in use`);
    }
    Object.assign(parent, dto);
    await this.parentsRepo.save(parent);
    return this.findOne(id);
  }

  async remove(id: string) {
    const parent = await this.parentsRepo.findOneBy({ id });
    if (!parent) throw new NotFoundException(`Parent #${id} not found`);
    await this.parentsRepo.remove(parent);
  }
}
