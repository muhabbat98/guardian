import {
  Controller, Get, Post, Put, Delete,
  Param, Body, HttpCode, HttpStatus, UseGuards, Req,
} from '@nestjs/common';
import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../auth/entities/user.entity';

@Controller('students')
@UseGuards(JwtAuthGuard, RolesGuard)
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Get()
  @Roles(UserRole.STUDENT, UserRole.TEACHER, UserRole.PARENT, UserRole.ADMIN)
  findAll() {
    return this.studentsService.findAll();
  }

  @Get(':id')
  @Roles(UserRole.STUDENT, UserRole.TEACHER, UserRole.PARENT, UserRole.ADMIN)
  findOne(@Param('id') id: string, @Req() req: any) {
    return this.studentsService.findOne(id, req.user);
  }

  @Post()
  @Roles(UserRole.ADMIN)
  create(@Body() dto: CreateStudentDto) {
    return this.studentsService.create(dto);
  }

  @Put(':id')
  @Roles(UserRole.STUDENT, UserRole.ADMIN)
  update(@Param('id') id: string, @Body() dto: UpdateStudentDto, @Req() req: any) {
    return this.studentsService.update(id, dto, req.user);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.studentsService.remove(id);
  }
}
