import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Propriete, StatutPropriete } from './entities/propriete.entity';
import { Photo } from './entities/photo.entity';
import { Proprietaire } from '../users/entities/proprietaire.entity';
import { CreatePropertyDto } from './dto/create-property.dto';
import { NotificationsService } from '../notifications/notifications.service';
import { PropertiesGateway } from './properties.gateway';

@Injectable()
export class PropertiesService {
  constructor(
    @InjectRepository(Propriete)
    private readonly proprieteRepo: Repository<Propriete>,
    @InjectRepository(Photo)
    private readonly photoRepo: Repository<Photo>,
    @InjectRepository(Proprietaire)
    private readonly proprietaireRepo: Repository<Proprietaire>,
    private readonly notificationsService: NotificationsService,
    private readonly propertiesGateway: PropertiesGateway,
  ) {}

  async createWithPhotos(
    dto: CreatePropertyDto,
    files: {
      mainPhoto?: Express.Multer.File[];
      images?: Express.Multer.File[];
    },
    userId: number,
  ): Promise<Propriete> {
    // 1. Vérifier si le profil propriétaire existe
    const owner = await this.proprietaireRepo.findOne({
      where: { user: { id: userId } },
    });

    if (!owner) {
      throw new NotFoundException('Profil propriétaire introuvable.');
    }

    // 2. Créer l'objet propriété (instanciation explicite pour éviter les ambiguïtés de surcharge)
    const nouvelle = new Propriete();
    nouvelle.titre = dto.titre;
    nouvelle.description = dto.description ?? null;
    nouvelle.adresse = dto.adresse;
    nouvelle.type = dto.type;
    nouvelle.prix = Number(dto.prix);
    nouvelle.superficie = dto.superficie ? Number(dto.superficie) : null;
    nouvelle.nombrePieces = Number(dto.nombrePieces);
    nouvelle.contratClauses = dto.contratClauses ?? null;
    nouvelle.proprietaire = owner;

    const propertySaved: Propriete = await this.proprieteRepo.save(nouvelle);

    const mainFile = files?.mainPhoto?.[0];
    const extraFiles = files?.images ?? [];

    if (!mainFile) {
      throw new BadRequestException('La photo principale est obligatoire.');
    }
    if (extraFiles.length < 5) {
      throw new BadRequestException(
        'Veuillez ajouter au moins 5 photos supplémentaires.',
      );
    }

    // 3. Sauvegarder les photos (1 principale + autres)
    const photos = [
      { file: mainFile, isMain: true },
      ...extraFiles.map((file) => ({ file, isMain: false })),
    ].map(({ file, isMain }) => {
      const photo = new Photo();
      photo.url = file.filename;
      photo.isMain = isMain;
      photo.propriete = propertySaved;
      return photo;
    });
    await this.photoRepo.save(photos);

    // 4. Retourner l'objet complet avec photos
    return this.findOne(propertySaved.id);
  }

  async findManyByUser(ownerId: number): Promise<Propriete[]> {
    const props = await this.proprieteRepo.find({
      where: { proprietaire: { id: ownerId } },
      relations: ['photos'],
    });
    return props.map((p) => this.sortPhotos(p));
  }

  // Retourne toutes les propriétés publiques (avec relations utiles)
  async findAll(): Promise<Propriete[]> {
    // Only return properties that are available to the public
    const props = await this.proprieteRepo.find({
      where: { statut: StatutPropriete.DISPONIBLE },
      relations: ['photos', 'proprietaire'],
      order: { id: 'DESC' },
    });
    return props.map((p) => this.sortPhotos(p));
  }

  async findOne(id: number): Promise<Propriete> {
    const p = await this.proprieteRepo.findOne({
      where: { id },
      relations: ['photos', 'proprietaire', 'proprietaire.user'],
    });
    if (!p) throw new NotFoundException('Propriété introuvable');
    return this.sortPhotos(p);
  }

  async remove(id: number): Promise<Propriete> {
    const p = await this.findOne(id);
    return this.proprieteRepo.remove(p);
  }

  async update(
    id: number,
    dto: CreatePropertyDto,
    files: {
      mainPhoto?: Express.Multer.File[];
      images?: Express.Multer.File[];
    },
  ): Promise<Propriete> {
    const p = await this.proprieteRepo.preload({ id, ...dto });
    if (!p) throw new NotFoundException('Propriété introuvable');

    const mainFile = files?.mainPhoto?.[0];
    const extraFiles = files?.images ?? [];

    if (mainFile) {
      const existing = await this.photoRepo.find({
        where: { propriete: { id } },
      });
      if (existing.length > 0) {
        existing.forEach((photo) => {
          photo.isMain = false;
        });
        await this.photoRepo.save(existing);
      }

      const mainPhoto = new Photo();
      mainPhoto.url = mainFile.filename;
      mainPhoto.isMain = true;
      mainPhoto.propriete = p;
      await this.photoRepo.save(mainPhoto);
    }

    if (extraFiles.length > 0) {
      const newPhotos = extraFiles.map((file) => {
        const photo = new Photo();
        photo.url = file.filename;
        photo.isMain = false;
        photo.propriete = p;
        return photo;
      });
      await this.photoRepo.save(newPhotos);
    }

    return this.proprieteRepo.save(p);
  }

  // Handle contact message sending (kept simple: logs and returns confirmation)
  async contactAgent(
    propertyId: number,
    payload: {
      name?: string;
      email?: string;
      phone?: string;
      message?: string;
    },
  ) {
    const prop = await this.proprieteRepo.findOne({
      where: { id: propertyId },
      relations: ['proprietaire'],
    });
    if (!prop) throw new NotFoundException('Propriété introuvable');

    // In a real app you'd persist this or send an email; for now we just log
    console.log(`Contact request for property ${propertyId}:`, payload);

    // create a notification for the property owner (simulation)
    try {
      await this.notificationsService.createForProprietaire(
        prop.proprietaire.id,
        {
          title: `Nouveau message pour "${prop.titre}"`,
          body: `${payload.name || 'Un visiteur'} a envoyé un message: ${payload.message?.slice(0, 200) || ''}`,
        },
      );
    } catch (error) {
      console.warn(
        'Impossible de créer la notification:',
        this.getErrorMessage(error),
      );
    }

    return {
      ok: true,
      message: "Message envoyé à l'agent (simulation)",
      agent: prop.proprietaire,
    };
  }

  // Handle reservation request
  async reserveVisit(
    propertyId: number,
    payload: { name?: string; email?: string; phone?: string; date?: string },
  ) {
    const prop = await this.proprieteRepo.findOne({
      where: { id: propertyId },
      relations: ['proprietaire'],
    });
    if (!prop) throw new NotFoundException('Propriété introuvable');

    console.log(`Reservation request for property ${propertyId}:`, payload);

    // create a notification for the owner
    try {
      await this.notificationsService.createForProprietaire(
        prop.proprietaire.id,
        {
          title: `Nouvelle demande de visite pour "${prop.titre}"`,
          body: `${payload.name || 'Un visiteur'} demande une visite le ${payload.date || 'date non précisée'}`,
        },
      );
    } catch (error) {
      console.warn(
        'Impossible de créer la notification:',
        this.getErrorMessage(error),
      );
    }

    return {
      ok: true,
      message: 'Demande de visite enregistrée (simulation)',
      scheduled: payload.date || null,
      agent: prop.proprietaire,
    };
  }

  // Update property status (vendu / loué)
  async updateStatus(propertyId: number, statusRaw: string) {
    const prop = await this.proprieteRepo.findOne({
      where: { id: propertyId },
      relations: ['proprietaire', 'proprietaire.user', 'photos'],
    });
    if (!prop) throw new NotFoundException('Propriété introuvable');

    // Only authenticated users can change status - authentication is handled by the controller's AuthGuard

    // Can't change if not available
    if (prop.statut !== StatutPropriete.DISPONIBLE) {
      throw new BadRequestException("Le bien n'est pas disponible");
    }

    // Normalize status (remove diacritics & lower)
    const s = (statusRaw || '')
      .toString()
      .toLowerCase()
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '');
    if (s === 'vendu') prop.statut = StatutPropriete.VENDU;
    else if (s === 'loue' || s === 'loue') prop.statut = StatutPropriete.LOUE;
    else throw new BadRequestException('Statut invalide');

    const saved = await this.proprieteRepo.save(prop);

    // create a notification for the owner
    try {
      await this.notificationsService.createForProprietaire(
        prop.proprietaire.id,
        {
          title: `Statut mis à jour: ${saved.titre}`,
          body: `Le bien a été marqué comme ${saved.statut}`,
        },
      );
    } catch (error) {
      console.warn(
        'Impossible de créer notification statut:',
        this.getErrorMessage(error),
      );
    }

    // emit socket update so dashboard updates in realtime
    try {
      this.propertiesGateway.emitUpdated(saved);
    } catch (e) {
      console.warn("Impossible d'émettre l'évènement socket:", e);
    }

    return saved;
  }

  private sortPhotos(p: Propriete): Propriete {
    if (!p?.photos || p.photos.length === 0) return p;
    p.photos = [...p.photos].sort((a, b) => {
      if (a.isMain === b.isMain) return a.id - b.id;
      return a.isMain ? -1 : 1;
    });
    return p;
  }

  private getErrorMessage(error: unknown): string {
    if (error instanceof Error) return error.message;
    return typeof error === 'string' ? error : String(error);
  }
}
