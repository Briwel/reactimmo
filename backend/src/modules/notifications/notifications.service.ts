import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './notification.entity';
import { Proprietaire } from '../users/entities/proprietaire.entity';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepo: Repository<Notification>,
    @InjectRepository(Proprietaire)
    private readonly proprietaireRepo: Repository<Proprietaire>,
  ) {}

  async createForProprietaire(
    proprietaireId: number,
    payload: { title: string; body?: string; meta?: any },
  ) {
    const owner = await this.proprietaireRepo.findOne({
      where: { id: proprietaireId },
    });
    if (!owner) throw new NotFoundException('Propriétaire introuvable');

    const n = new Notification();
    n.title = payload.title;
    n.body = payload.body ?? null;
    n.proprietaire = owner;

    return this.notificationRepo.save(n);
  }

  async findForUser(userId: number) {
    const owner = await this.proprietaireRepo.findOne({
      where: { user: { id: userId } },
    });
    if (!owner) throw new NotFoundException('Profil propriétaire introuvable');

    return this.notificationRepo.find({
      where: { proprietaire: { id: owner.id } },
      order: { id: 'DESC' },
    });
  }

  async markRead(notificationId: number, userId: number) {
    const n = await this.notificationRepo.findOne({
      where: { id: notificationId },
      relations: ['proprietaire', 'proprietaire.user'],
    });
    if (!n) throw new NotFoundException('Notification introuvable');
    if (!n.proprietaire || n.proprietaire.user?.id !== userId)
      throw new ForbiddenException('Accès refusé');

    n.read = true;
    return this.notificationRepo.save(n);
  }

  async markAllRead(userId: number) {
    const owner = await this.proprietaireRepo.findOne({
      where: { user: { id: userId } },
    });
    if (!owner) throw new NotFoundException('Profil propriétaire introuvable');

    await this.notificationRepo.update(
      { proprietaire: { id: owner.id }, read: false } as any,
      { read: true } as any,
    );
    return { ok: true };
  }
}
