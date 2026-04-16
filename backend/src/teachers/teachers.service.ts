import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Teacher } from './entities/teacher.entity';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';

@Injectable()
export class TeachersService {
  constructor(
    @InjectRepository(Teacher)
    private teachersRepo: Repository<Teacher>,
  ) {}

  private toResponse(teacher: Teacher) {
    return {
      id: teacher.id,
      firstName: teacher.firstName,
      lastName: teacher.lastName,
      email: teacher.email,
      phone: teacher.phone,
      specialization: teacher.specialization,
    };
  }

  async findAll() {
    const teachers = await this.teachersRepo.find();
    return teachers.map(this.toResponse.bind(this));
  }

  async findOne(id: string) {
    const teacher = await this.teachersRepo.findOneBy({ id });
    if (!teacher) throw new NotFoundException(`Teacher #${id} not found`);
    return this.toResponse(teacher);
  }

  async create(dto: CreateTeacherDto) {
    const existing = await this.teachersRepo.findOneBy({ email: dto.email });
    if (existing) throw new ConflictException(`Email ${dto.email} already in use`);
    const teacher = this.teachersRepo.create(dto);
    const saved = await this.teachersRepo.save(teacher);
    return this.toResponse(saved);
  }

  async update(id: string, dto: UpdateTeacherDto) {
    const teacher = await this.teachersRepo.findOneBy({ id });
    if (!teacher) throw new NotFoundException(`Teacher #${id} not found`);
    if (dto.email && dto.email !== teacher.email) {
      const existing = await this.teachersRepo.findOneBy({ email: dto.email });
      if (existing) throw new ConflictException(`Email ${dto.email} already in use`);
    }
    Object.assign(teacher, dto);
    const saved = await this.teachersRepo.save(teacher);
    return this.toResponse(saved);
  }

  async remove(id: string) {
    const teacher = await this.teachersRepo.findOneBy({ id });
    if (!teacher) throw new NotFoundException(`Teacher #${id} not found`);
    await this.teachersRepo.remove(teacher);
  }
}
