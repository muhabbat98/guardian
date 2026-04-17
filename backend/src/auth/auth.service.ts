import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from './entities/user.entity';
import { Teacher } from '../teachers/entities/teacher.entity';
import { Parent } from '../parents/entities/parent.entity';
import { Student } from '../students/entities/student.entity';
import { SignupDto } from './dto/signup.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepo: Repository<User>,
    @InjectRepository(Teacher)
    private teachersRepo: Repository<Teacher>,
    @InjectRepository(Parent)
    private parentsRepo: Repository<Parent>,
    @InjectRepository(Student)
    private studentsRepo: Repository<Student>,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersRepo.findOneBy({ email });
    if (!user) return null;
    const match = await bcrypt.compare(password, user.password);
    if (!match) return null;
    const { password: _, ...result } = user;
    return result;
  }

  async signup(dto: SignupDto) {
    const existing = await this.usersRepo.findOneBy({ email: dto.email });
    if (existing) throw new ConflictException('Email already in use');

    const hashed = await bcrypt.hash(dto.password, 10);
    const user = await this.usersRepo.save(
      this.usersRepo.create({
        email: dto.email,
        password: hashed,
        role: dto.role,
        firstName: dto.firstName,
        lastName: dto.lastName,
      }),
    );

    if (dto.role === UserRole.TEACHER) {
      if (dto.teacherId) {
        const teacher = await this.teachersRepo.findOneBy({ id: dto.teacherId });
        if (!teacher) throw new NotFoundException(`Teacher #${dto.teacherId} not found`);
        await this.teachersRepo.update(dto.teacherId, { userId: user.id });
      } else {
        await this.teachersRepo.save(
          this.teachersRepo.create({
            firstName: dto.firstName,
            lastName: dto.lastName,
            email: dto.email,
            phone: dto.phone ?? '',
            specialization: dto.specialization ?? '',
            userId: user.id,
          }),
        );
      }
    }

    if (dto.role === UserRole.PARENT) {
      await this.parentsRepo.save(
        this.parentsRepo.create({
          firstName: dto.firstName,
          lastName: dto.lastName,
          email: dto.email,
          phone: dto.phone ?? '',
          address: dto.address,
          userId: user.id,
        }),
      );
    }

    if (dto.role === UserRole.STUDENT && dto.studentId) {
      const student = await this.studentsRepo.findOneBy({ id: dto.studentId });
      if (!student) throw new NotFoundException(`Student #${dto.studentId} not found`);
      await this.studentsRepo.update(dto.studentId, { userId: user.id });
    }

    return this.issueTokenResponse(user);
  }

  signin(user: Omit<User, 'password'>) {
    return this.issueTokenResponse(user as User);
  }

  private issueTokenResponse(user: User) {
    const payload = { sub: user.id, email: user.email, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    };
  }
}
