import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Propriete } from './entities/propriete.entity';
import { CreatePropertyDto } from './dto/create-property.dto';

@Injectable()
export class PropertiesService {
  constructor(
    @InjectRepository(Propriete)
    private readonly proprieteRepo: Repository<Propriete>,
  ) {}

  // CRÉATION
  async create(data: CreatePropertyDto) {
    const nouveauBien = this.proprieteRepo.create(data);
    return await this.proprieteRepo.save(nouveauBien);
  }

  // TOUT RÉCUPÉRER
  async findAll() {
    return await this.proprieteRepo.find({ relations: ['photos'] });
  }

  // RÉCUPÉRER UN SEUL BIEN
  async findOne(id: number) {
    const bien = await this.proprieteRepo.findOne({
      where: { id },
      relations: ['photos'],
    });
    if (!bien)
      throw new NotFoundException(`Le bien avec l'id ${id} n'existe pas`);
    return bien;
  }

  // SUPPRIMER
  async remove(id: number) {
    const bien = await this.findOne(id); // Réutilise findOne pour vérifier l'existence
    return await this.proprieteRepo.remove(bien);
  }
}
