import {
  Controller, Get, Post, Put, Delete,
  Param, Body, Query, HttpCode, HttpStatus,
} from '@nestjs/common';
import { AgreementsService } from './agreements.service';
import { CreateAgreementDto } from './dto/create-agreement.dto';
import { UpdateAgreementDto } from './dto/update-agreement.dto';

@Controller('agreements')
export class AgreementsController {
  constructor(private readonly agreementsService: AgreementsService) {}

  @Get()
  findAll(@Query('studentId') studentId?: string) {
    return this.agreementsService.findAll(studentId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.agreementsService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateAgreementDto) {
    return this.agreementsService.create(dto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateAgreementDto) {
    return this.agreementsService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.agreementsService.remove(id);
  }
}
