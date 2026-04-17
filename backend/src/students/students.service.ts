import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Student } from './entities/student.entity';
import { Activity } from '../activities/entities/activity.entity';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { UserRole } from '../auth/entities/user.entity';

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(Student)
    private studentsRepo: Repository<Student>,
    @InjectRepository(Activity)
    private activitiesRepo: Repository<Activity>,
  ) {}

  private toResponse(student: Student) {
    return {
      id: student.id,
      firstName: student.firstName,
      lastName: student.lastName,
      dateOfBirth: student.dateOfBirth,
      parentId: student.parentId ?? undefined,
      address: student.address ?? undefined,
      enrollmentDate: student.enrollmentDate,
      activities: (student.activities ?? []).map((a) => a.id),
    };
  }

  async findAll() {
    const students = await this.studentsRepo.find({
      relations: ['activities'],
    });
    return students.map(this.toResponse.bind(this));
  }

  async findOne(id: string, user?: any) {
    const student = await this.studentsRepo.findOne({
      where: { id },
      relations: ['activities'],
    });
    if (!student) throw new NotFoundException(`Student #${id} not found`);

    // Students can only see themselves (unless admin)
    if (user && user.role !== UserRole.ADMIN && user.role === UserRole.STUDENT) {
      if (student.userId !== user.id) {
        throw new ForbiddenException('You can only view your own profile');
      }
    }

    return this.toResponse(student);
  }

  async create(dto: CreateStudentDto) {
    const student = this.studentsRepo.create({
      firstName: dto.firstName,
      lastName: dto.lastName,
      dateOfBirth: dto.dateOfBirth,
      parentId: dto.parentId,
      address: dto.address,
      enrollmentDate: dto.enrollmentDate,
    });
    const saved = await this.studentsRepo.save(student);

    // Enroll student into activities via the Activity side (Activity owns the join table)
    if (dto.activities?.length) {
      const activities = await this.activitiesRepo.find({
        where: { id: In(dto.activities) },
        relations: ['students'],
      });
      for (const activity of activities) {
        if (!activity.students.find((s) => s.id === saved.id)) {
          activity.students = [...activity.students, saved];
          await this.activitiesRepo.save(activity);
        }
      }
    }

    return this.findOne(saved.id);
  }

  async update(id: string, dto: UpdateStudentDto, user?: any) {
    const student = await this.studentsRepo.findOne({
      where: { id },
      relations: ['activities'],
    });
    if (!student) throw new NotFoundException(`Student #${id} not found`);

    // Students can only update their own profile
    if (user && user.role === UserRole.STUDENT && student.userId !== user.id) {
      throw new ForbiddenException('You can only update your own profile');
    }

    // Update scalar fields
    const fields = [
      'firstName', 'lastName', 'dateOfBirth', 'parentId', 'address', 'enrollmentDate',
    ] as const;
    for (const field of fields) {
      if (dto[field] !== undefined) (student as any)[field] = dto[field];
    }
    await this.studentsRepo.save(student);

    // Update activity enrollments if provided
    if (dto.activities !== undefined) {
      const currentIds = student.activities.map((a) => a.id);
      const newIds = dto.activities;

      const toRemove = currentIds.filter((cid) => !newIds.includes(cid));
      const toAdd = newIds.filter((nid) => !currentIds.includes(nid));

      if (toRemove.length) {
        const removeActivities = await this.activitiesRepo.find({
          where: { id: In(toRemove) },
          relations: ['students'],
        });
        for (const act of removeActivities) {
          act.students = act.students.filter((s) => s.id !== id);
          await this.activitiesRepo.save(act);
        }
      }

      if (toAdd.length) {
        const addActivities = await this.activitiesRepo.find({
          where: { id: In(toAdd) },
          relations: ['students'],
        });
        const updatedStudent = await this.studentsRepo.findOneBy({ id });
        for (const act of addActivities) {
          if (!act.students.find((s) => s.id === id)) {
            act.students = [...act.students, updatedStudent];
            await this.activitiesRepo.save(act);
          }
        }
      }
    }

    return this.findOne(id);
  }

  async remove(id: string) {
    const student = await this.studentsRepo.findOne({
      where: { id },
      relations: ['activities'],
    });
    if (!student) throw new NotFoundException(`Student #${id} not found`);

    // Remove from all activities
    for (const activity of student.activities) {
      const act = await this.activitiesRepo.findOne({
        where: { id: activity.id },
        relations: ['students'],
      });
      if (act) {
        act.students = act.students.filter((s) => s.id !== id);
        await this.activitiesRepo.save(act);
      }
    }

    await this.studentsRepo.remove(student);
  }
}
