import {
  Controller, Get, Post, Put, Delete,
  Param, Body, Query, HttpCode, HttpStatus, UseGuards, Req,
} from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../auth/entities/user.entity';

@Controller('appointments')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Get()
  @Roles(UserRole.PARENT, UserRole.TEACHER, UserRole.ADMIN)
  findAll(
    @Query('parentId') parentId?: string,
    @Query('teacherId') teacherId?: string,
  ) {
    return this.appointmentsService.findAll(parentId, teacherId);
  }

  @Get(':id')
  @Roles(UserRole.PARENT, UserRole.TEACHER, UserRole.ADMIN)
  findOne(@Param('id') id: string) {
    return this.appointmentsService.findOne(id);
  }

  @Post()
  @Roles(UserRole.PARENT, UserRole.ADMIN)
  create(@Body() dto: CreateAppointmentDto, @Req() req: any) {
    return this.appointmentsService.create(dto, req.user);
  }

  @Put(':id')
  @Roles(UserRole.PARENT, UserRole.TEACHER, UserRole.ADMIN)
  update(@Param('id') id: string, @Body() dto: UpdateAppointmentDto, @Req() req: any) {
    return this.appointmentsService.update(id, dto, req.user);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles(UserRole.PARENT, UserRole.ADMIN)
  remove(@Param('id') id: string, @Req() req: any) {
    return this.appointmentsService.remove(id, req.user);
  }
}
