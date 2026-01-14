import {
  Controller,
  Post,
  Get,
  Body,
  Patch,
  Param,
  ParseIntPipe,
  Query,
  UseGuards,
  Req,
  ForbiddenException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { OperationsService } from './operations.service';
import { CreateOperationDto } from './dto/create-operation.dto';
import { ConfirmOperationDto } from './dto/confirm-operation.dto';

@Controller('operations')
export class OperationsController {
  constructor(private readonly operationsService: OperationsService) {}

  @Post('create')
  async create(@Body() dto: CreateOperationDto) {
    return this.operationsService.create(dto);
  }

  @Get()
  // Public endpoint: returns all operations (admin)
  async getAll() {
    return this.operationsService.findAll();
  }

  @Get('property/:id')
  // Public: operations for a property
  async byProperty(@Param('id', ParseIntPipe) id: number) {
    return this.operationsService.findForProperty(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('agent/me')
  // Returns operations for the authenticated agent
  async myOperations(@Req() req: any, @Query('pending') pending?: string) {
    return this.operationsService.findForAgent(req.user.id, pending === 'true');
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('client/:clientId')
  // Returns operations for a specific client but only for the authenticated agent's properties
  async byClientForAgent(@Req() req: any, @Param('clientId', ParseIntPipe) clientId: number) {
    return this.operationsService.findForAgentByClient(req.user.id, clientId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id/confirmer')
  async confirmer(
    @Req() req: any,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ConfirmOperationDto,
  ) {
    // Ensure the authenticated user is allowed to confirm this operation
    return this.operationsService.confirmerOperation(id, dto, req.user.id);
  }
}
