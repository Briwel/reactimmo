import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Propriete } from './entities/propriete.entity';
import { Photo } from './entities/photo.entity';
import { CreatePropertyDto } from './dto/create-property.dto';

@Injectable()
export class PropertiesService {
  constructor(
    @InjectRepository(Propriete)
    private readonly proprieteRepo: Repository<Propriete>,

    @InjectRepository(Photo)
    private readonly photoRepo: Repository<Photo>,
  ) {}

  /**
   * CRÉATION UNIFIÉE (Texte + Photos)
   */
  async createWithPhotos(
    createPropertyDto: CreatePropertyDto,
    filenames: string[],
  ) {
    // 1. Créer l'instance de la propriété avec les données du DTO
    const nouvellePropriete = this.proprieteRepo.create(createPropertyDto);

    // 2. Transformer les noms de fichiers en entités Photo
    if (filenames && filenames.length > 0) {
      nouvellePropriete.photos = filenames.map((name) =>
        this.photoRepo.create({ url: name }),
      );
    }

    // 3. Sauvegarder (la cascade s'occupe d'enregistrer les photos et de créer le lien ID)
    return await this.proprieteRepo.save(nouvellePropriete);
  }

  /**
   * RÉCUPÉRER TOUT (avec transformation des URLs)
   */
  async findAll() {
    const properties = await this.proprieteRepo.find({ relations: ['photos'] });

    return properties.map((p) => ({
      ...p,
      photos: p.photos
        ? p.photos.map((photo) => ({
            ...photo,
            url: `http://localhost:3000/uploads/${photo.url}`,
          }))
        : [],
    }));
  }

  /**
   * RÉCUPÉRER UN SEUL BIEN
   */
  async findOne(id: number) {
    const bien = await this.proprieteRepo.findOne({
      where: { id },
      relations: ['photos'],
    });

    if (!bien) {
      throw new NotFoundException(`Le bien avec l'id ${id} n'existe pas`);
    }

    // On transforme aussi les URLs pour le détail
    return {
      ...bien,
      photos: bien.photos.map((photo) => ({
        ...photo,
        url: `http://localhost:3000/uploads/${photo.url}`,
      })),
    };
  }

  /**
   * AJOUTER DES PHOTOS A POSTERIORI (Optionnel)
   */
  async addPhotos(propertyId: number, filenames: string[]) {
    const property = await this.findOne(propertyId);

    const photoEntities = filenames.map((name) => {
      return this.photoRepo.create({ url: name, propriete: property });
    });

    return await this.photoRepo.save(photoEntities);
  }

  /**
   * SUPPRIMER
   */
  async remove(id: number) {
    const bien = await this.proprieteRepo.findOne({ where: { id } });
    if (!bien) throw new NotFoundException(`Bien #${id} introuvable`);
    return await this.proprieteRepo.remove(bien);
  }

  async update(
    id: number,
    updatePropertyDto: Partial<CreatePropertyDto>,
    newFilenames?: string[],
  ) {
    // . Fusionner les modifications textuelles (titre, prix, etc.)
    // preload permet de récupérer l'entité et d'y injecter les nouvelles valeurs du DTO
    const propertyToUpdate = await this.proprieteRepo.preload({
      id: id,
      ...updatePropertyDto,
    });

    if (!propertyToUpdate) {
      throw new NotFoundException(
        `Le bien avec l'id ${id} n'a pas pu être préparé pour la mise à jour`,
      );
    }

    // 3. Si de nouvelles photos sont envoyées, on les ajoute à la liste existante
    if (newFilenames && newFilenames.length > 0) {
      const newPhotoEntities = newFilenames.map((name) =>
        this.photoRepo.create({ url: name, propriete: propertyToUpdate }),
      );

      // On sauvegarde les nouvelles photos
      await this.photoRepo.save(newPhotoEntities);
    }

    // 4. Sauvegarder les modifications globales du bien
    return await this.proprieteRepo.save(propertyToUpdate);
  }
}
