import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment, AppointmentStatus } from './entities/appointment.entity';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { UserRole } from '../auth/entities/user.entity';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentsRepo: Repository<Appointment>,
  ) {}

  private toResponse(appointment: Appointment) {
    return {
      id: appointment.id,
      parentId: appointment.parentId,
      teacherId: appointment.teacherId,
      date: appointment.date,
      time: appointment.time,
      status: appointment.status,
      notes: appointment.notes ?? undefined,
      createdAt: appointment.createdAt,
      updatedAt: appointment.updatedAt,
    };
  }

  async findAll(parentId?: string, teacherId?: string) {
    const where: any = {};
    if (parentId) where.parentId = parentId;
    if (teacherId) where.teacherId = teacherId;

    const appointments = await this.appointmentsRepo.find({ where });
    return appointments.map(this.toResponse.bind(this));
  }

  async findOne(id: string) {
    const appointment = await this.appointmentsRepo.findOne({ where: { id } });
    if (!appointment) throw new NotFoundException(`Appointment #${id} not found`);
    return this.toResponse(appointment);
  }

  async create(dto: CreateAppointmentDto, user?: any) {
    // Only parents and admins can create appointments
    if (user && user.role === UserRole.PARENT && user.parentId !== dto.parentId) {
      throw new ForbiddenException('You can only create appointments for yourself');
    }

    const appointment = this.appointmentsRepo.create({
      parentId: dto.parentId,
      teacherId: dto.teacherId,
      date: dto.date,
      time: dto.time,
      notes: dto.notes,
      status: AppointmentStatus.PENDING,
    });

    const saved = await this.appointmentsRepo.save(appointment);
    return this.findOne(saved.id);
  }

  async update(id: string, dto: UpdateAppointmentDto, user?: any) {
    const appointment = await this.appointmentsRepo.findOne({ where: { id } });
    if (!appointment) throw new NotFoundException(`Appointment #${id} not found`);

    // Teachers can only approve/reject appointments for them
    if (user && user.role === UserRole.TEACHER && appointment.teacherId !== user.teacherId) {
      throw new ForbiddenException('You can only manage appointments for yourself');
    }

    // Parents can only add notes to their own appointments
    if (user && user.role === UserRole.PARENT && appointment.parentId !== user.parentId && dto.notes) {
      throw new ForbiddenException('You can only update your own appointments');
    }

    if (dto.status !== undefined) appointment.status = dto.status;
    if (dto.notes !== undefined) appointment.notes = dto.notes;

    await this.appointmentsRepo.save(appointment);
    return this.findOne(id);
  }

  async remove(id: string, user?: any) {
    const appointment = await this.appointmentsRepo.findOne({ where: { id } });
    if (!appointment) throw new NotFoundException(`Appointment #${id} not found`);

    // Only the parent who created it or admin can delete
    if (user && user.role === UserRole.PARENT && appointment.parentId !== user.parentId) {
      throw new ForbiddenException('You can only delete your own appointments');
    }

    await this.appointmentsRepo.remove(appointment);
  }
}
