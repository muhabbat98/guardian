import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Activity } from './entities/activity.entity';
import { Teacher } from '../teachers/entities/teacher.entity';
import { Student } from '../students/entities/student.entity';
import { ActivitiesService } from './activities.service';
import { ActivitiesController } from './activities.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Activity, Teacher, Student])],
  providers: [ActivitiesService],
  controllers: [ActivitiesController],
  exports: [ActivitiesService],
})
export class ActivitiesModule {}
