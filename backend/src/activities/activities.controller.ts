import {
  Controller, Get, Post, Put, Delete,
  Param, Body, HttpCode, HttpStatus, UseGuards, Req,
} from '@nestjs/common';
import { ActivitiesService } from './activities.service';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../auth/entities/user.entity';

@Controller('activities')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService) {}

  @Get()
  @Roles(UserRole.STUDENT, UserRole.TEACHER, UserRole.PARENT, UserRole.ADMIN)
  findAll() {
    return this.activitiesService.findAll();
  }

  @Get(':id')
  @Roles(UserRole.STUDENT, UserRole.TEACHER, UserRole.PARENT, UserRole.ADMIN)
  findOne(@Param('id') id: string) {
    return this.activitiesService.findOne(id);
  }

  @Post()
  @Roles(UserRole.TEACHER, UserRole.ADMIN)
  create(@Body() dto: CreateActivityDto, @Req() req: any) {
    return this.activitiesService.create(dto, req.user);
  }

  @Put(':id')
  @Roles(UserRole.TEACHER, UserRole.ADMIN)
  update(@Param('id') id: string, @Body() dto: UpdateActivityDto, @Req() req: any) {
    return this.activitiesService.update(id, dto, req.user);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles(UserRole.TEACHER, UserRole.ADMIN)
  remove(@Param('id') id: string, @Req() req: any) {
    return this.activitiesService.remove(id, req.user);
  }
}
