import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { PropertiesService } from './properties.service';
import { CreatePropertyDto } from './dto/create-property.dto';

@Controller('properties')
export class PropertiesController {
  constructor(private readonly propertiesService: PropertiesService) {}

  @Post('add')
  async create(@Body() createPropertyDto: CreatePropertyDto) {
    return this.propertiesService.create(createPropertyDto);
  }

  @Get()
  async getAll() {
    return this.propertiesService.findAll();
  }

  @Get(':id')
  async getOne(@Param('id', ParseIntPipe) id: number) {
    // Vérifie que findOne existe dans ton service
    return this.propertiesService.findOne(id);
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    // Vérifie que remove existe dans ton service
    return this.propertiesService.remove(id);
  }
}
