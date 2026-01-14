import { Controller, Get, Patch, Param, UseGuards, Req } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { AuthGuard } from '@nestjs/passport';

interface RequestWithUser extends Request {
  user: { id: number; email: string };
}

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get('mine')
  @UseGuards(AuthGuard('jwt'))
  async mine(@Req() req: RequestWithUser) {
    return this.notificationsService.findForUser(req.user.id);
  }

  @Patch(':id/read')
  @UseGuards(AuthGuard('jwt'))
  async markRead(@Param('id') id: number, @Req() req: RequestWithUser) {
    return this.notificationsService.markRead(Number(id), req.user.id);
  }

  @Patch('read-all')
  @UseGuards(AuthGuard('jwt'))
  async markAll(@Req() req: RequestWithUser) {
    return this.notificationsService.markAllRead(req.user.id);
  }
}
