import {
  Controller, Get, Post, Put, Delete,
  Param, Body, Query, HttpCode, HttpStatus,
} from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';

@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Get()
  findAll(
    @Query('studentId') studentId?: string,
    @Query('activityId') activityId?: string,
  ) {
    return this.attendanceService.findAll(studentId, activityId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.attendanceService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateAttendanceDto) {
    return this.attendanceService.create(dto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateAttendanceDto) {
    return this.attendanceService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.attendanceService.remove(id);
  }
}
