import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from './entities/student.entity';
import { Activity } from '../activities/entities/activity.entity';
import { StudentsService } from './students.service';
import { StudentsController } from './students.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Student, Activity])],
  providers: [StudentsService],
  controllers: [StudentsController],
  exports: [StudentsService],
})
export class StudentsModule {}
