import { Controller, Post, Get, Body } from '@nestjs/common';
import { OperationsService } from './operations.service';
import { CreateOperationDto } from './dto/create-operation.dto';

@Controller('operations')
export class OperationsController {
  constructor(private readonly operationsService: OperationsService) {}

  @Post('create')
  async create(@Body() dto: CreateOperationDto) {
    return this.operationsService.create(dto);
  }

  @Get()
  async getAll() {
    return this.operationsService.findAll();
  }
}
