import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Activity } from './entities/activity.entity';
import { Teacher } from '../teachers/entities/teacher.entity';
import { Student } from '../students/entities/student.entity';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';
import { UserRole } from '../auth/entities/user.entity';

@Injectable()
export class ActivitiesService {
  constructor(
    @InjectRepository(Activity)
    private activitiesRepo: Repository<Activity>,
    @InjectRepository(Teacher)
    private teachersRepo: Repository<Teacher>,
    @InjectRepository(Student)
    private studentsRepo: Repository<Student>,
  ) {}

  private toResponse(activity: Activity) {
    return {
      id: activity.id,
      name: activity.name,
      time: activity.time,
      dayOfWeek: activity.dayOfWeek,
      description: activity.description ?? undefined,
      capacity: activity.capacity ?? undefined,
      teachers: (activity.teachers ?? []).map((t) => t.id),
      students: (activity.students ?? []).map((s) => s.id),
    };
  }

  async findAll() {
    const activities = await this.activitiesRepo.find({
      relations: ['teachers', 'students'],
    });
    return activities.map(this.toResponse.bind(this));
  }

  async findOne(id: string) {
    const activity = await this.activitiesRepo.findOne({
      where: { id },
      relations: ['teachers', 'students'],
    });
    if (!activity) throw new NotFoundException(`Activity #${id} not found`);
    return this.toResponse(activity);
  }

  async create(dto: CreateActivityDto, user?: any) {
    const teachers =
      dto.teachers?.length
        ? await this.teachersRepo.findBy({ id: In(dto.teachers) })
        : [];
    const students =
      dto.students?.length
        ? await this.studentsRepo.findBy({ id: In(dto.students) })
        : [];

    const activity = this.activitiesRepo.create({
      name: dto.name,
      time: dto.time,
      dayOfWeek: dto.dayOfWeek,
      description: dto.description,
      capacity: dto.capacity,
      createdByUserId: user?.id,
      teachers,
      students,
    });

    const saved = await this.activitiesRepo.save(activity);
    return this.findOne(saved.id);
  }

  async update(id: string, dto: UpdateActivityDto, user?: any) {
    const activity = await this.activitiesRepo.findOne({
      where: { id },
      relations: ['teachers', 'students'],
    });
    if (!activity) throw new NotFoundException(`Activity #${id} not found`);

    // Teachers can only edit their own activities
    if (user && user.role === UserRole.TEACHER && activity.createdByUserId !== user.id) {
      throw new ForbiddenException('You can only edit activities you created');
    }

    if (dto.teachers !== undefined) {
      activity.teachers = dto.teachers.length
        ? await this.teachersRepo.findBy({ id: In(dto.teachers) })
        : [];
    }
    if (dto.students !== undefined) {
      activity.students = dto.students.length
        ? await this.studentsRepo.findBy({ id: In(dto.students) })
        : [];
    }

    if (dto.name !== undefined) activity.name = dto.name;
    if (dto.time !== undefined) activity.time = dto.time;
    if (dto.dayOfWeek !== undefined) activity.dayOfWeek = dto.dayOfWeek;
    if (dto.description !== undefined) activity.description = dto.description;
    if (dto.capacity !== undefined) activity.capacity = dto.capacity;

    await this.activitiesRepo.save(activity);
    return this.findOne(id);
  }

  async remove(id: string, user?: any) {
    const activity = await this.activitiesRepo.findOneBy({ id });
    if (!activity) throw new NotFoundException(`Activity #${id} not found`);

    // Teachers can only delete their own activities
    if (user && user.role === UserRole.TEACHER && activity.createdByUserId !== user.id) {
      throw new ForbiddenException('You can only delete activities you created');
    }

    await this.activitiesRepo.remove(activity);
  }
}
