import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AttendanceRecord } from './entities/attendance.entity';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(AttendanceRecord)
    private attendanceRepo: Repository<AttendanceRecord>,
  ) {}

  private toResponse(record: AttendanceRecord) {
    return {
      id: record.id,
      studentId: record.studentId,
      activityId: record.activityId,
      date: record.date,
      status: record.status,
      notes: record.notes ?? undefined,
    };
  }

  async findAll(studentId?: string, activityId?: string) {
    const where: any = {};
    if (studentId) where.studentId = studentId;
    if (activityId) where.activityId = activityId;

    const records = await this.attendanceRepo.find({ where, order: { date: 'DESC' } });
    return records.map(this.toResponse.bind(this));
  }

  async findOne(id: string) {
    const record = await this.attendanceRepo.findOneBy({ id });
    if (!record) throw new NotFoundException(`Attendance record #${id} not found`);
    return this.toResponse(record);
  }

  async create(dto: CreateAttendanceDto) {
    const record = this.attendanceRepo.create({
      studentId: dto.studentId,
      activityId: dto.activityId,
      date: dto.date,
      status: dto.status,
      notes: dto.notes,
    });
    const saved = await this.attendanceRepo.save(record);
    return this.toResponse(saved);
  }

  async update(id: string, dto: UpdateAttendanceDto) {
    const record = await this.attendanceRepo.findOneBy({ id });
    if (!record) throw new NotFoundException(`Attendance record #${id} not found`);
    Object.assign(record, dto);
    const saved = await this.attendanceRepo.save(record);
    return this.toResponse(saved);
  }

  async remove(id: string) {
    const record = await this.attendanceRepo.findOneBy({ id });
    if (!record) throw new NotFoundException(`Attendance record #${id} not found`);
    await this.attendanceRepo.remove(record);
  }
}
