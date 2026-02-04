import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseIntPipe,
  UseInterceptors,
  UploadedFiles,
  UseGuards,
  Req,
  Patch,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { PropertiesService } from './properties.service';
import { AuthGuard } from '@nestjs/passport';
import { CreatePropertyDto } from './dto/create-property.dto';
import { Propriete } from './entities/propriete.entity';
import type { Request } from 'express';

const multerConfig = {
  storage: diskStorage({
    destination: './uploads',
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
    },
  }),
};

interface RequestWithUser extends Request {
  user: { id: number; email: string };
}

type PropertyUploadFiles = {
  mainPhoto?: Express.Multer.File[];
  images?: Express.Multer.File[];
};

type ContactPayload = {
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
};

type ReservePayload = {
  name?: string;
  email?: string;
  phone?: string;
  date?: string;
};

@Controller('properties')
export class PropertiesController {
  constructor(private readonly propertiesService: PropertiesService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'mainPhoto', maxCount: 1 },
        { name: 'images', maxCount: 20 },
      ],
      multerConfig,
    ),
  )
  async create(
    @Body() dto: CreatePropertyDto,
    @UploadedFiles() files: PropertyUploadFiles,
    @Req() req: RequestWithUser,
  ): Promise<Propriete> {
    // On envoie directement 'files' et 'req.user.id' au service
    return this.propertiesService.createWithPhotos(dto, files, req.user.id);
  }

  @Get()
  async findAll(): Promise<Propriete[]> {
    return this.propertiesService.findAll();
  }

  // Endpoint to receive contact messages for a property
  @Post(':id/contact')
  async contactAgent(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: ContactPayload,
  ) {
    return this.propertiesService.contactAgent(id, body);
  }

  // Endpoint to request a visit/reservation
  @Post(':id/reserve')
  async reserveVisit(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: ReservePayload,
  ) {
    return this.propertiesService.reserveVisit(id, body);
  }

  @Get('mine')
  @UseGuards(AuthGuard('jwt'))
  async findAllMine(@Req() req: RequestWithUser): Promise<Propriete[]> {
    return this.propertiesService.findManyByUser(req.user.id);
  }

  @Get(':id')
  async getOne(@Param('id', ParseIntPipe) id: number): Promise<Propriete> {
    return this.propertiesService.findOne(id);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async remove(@Param('id', ParseIntPipe) id: number): Promise<Propriete> {
    return this.propertiesService.remove(id);
  }

  @Patch(':id/status')
  @UseGuards(AuthGuard('jwt'))
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status') status: string,
  ): Promise<Propriete> {
    return this.propertiesService.updateStatus(id, status);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'mainPhoto', maxCount: 1 },
        { name: 'images', maxCount: 20 },
      ],
      multerConfig,
    ),
  )
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreatePropertyDto,
    @UploadedFiles() files: PropertyUploadFiles,
  ): Promise<Propriete> {
    return this.propertiesService.update(id, dto, files);
  }
}
