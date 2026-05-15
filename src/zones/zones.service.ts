import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Zone } from './zone.entity';

@Injectable()
export class ZonesService {
  constructor(
    @InjectRepository(Zone)
    private zonesRepository: Repository<Zone>,
    private dataSource: DataSource,
  ) {}

  async create(data: Partial<Zone> & { geometry: string }): Promise<Zone> {
    const zone = this.zonesRepository.create(data);
    const saved = await this.zonesRepository.save(zone);

    if (data.geometry) {
      await this.dataSource.query(
        `ALTER TABLE zones ADD COLUMN IF NOT EXISTS geometry geometry(Polygon, 4326);`
      );
      await this.dataSource.query(
        `UPDATE zones SET geometry = ST_GeomFromGeoJSON($1) WHERE id = $2`,
        [data.geometry, saved.id],
      );
    }

    return saved;
  }

  async findByCompany(company_id: string): Promise<Zone[]> {
    return this.zonesRepository.find({ where: { company_id, active: true } });
  }

  async findZonesContainingPoint(lat: number, lng: number): Promise<Zone[]> {
    return this.dataSource.query(
      `SELECT z.*, c.name as company_name, c.id as company_id
       FROM zones z
       JOIN companies c ON c.id = z.company_id
       WHERE z.active = true
       AND ST_Contains(z.geometry, ST_SetSRID(ST_MakePoint($1, $2), 4326))`,
      [lng, lat],
    );
  }

  async deactivate(id: string): Promise<Zone | null> {
    await this.zonesRepository.update(id, { active: false });
    return this.zonesRepository.findOne({ where: { id } });
  }
}