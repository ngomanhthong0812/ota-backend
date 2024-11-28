// floor/floor.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateFloorDTO } from './dto/creatfloor.dot';
import { UpdateFloorDTO } from './dto/updatefloor.dto';
import { FloorEntity } from 'src/entities/floor.entity';

@Injectable()
export class FloorService {
  constructor(
    @InjectRepository(FloorEntity)
    private readonly floorRepository: Repository<FloorEntity>,
  ) {}

  async create(createFloorDto: CreateFloorDTO): Promise<FloorEntity> {
    const floor = this.floorRepository.create(createFloorDto);
    return await this.floorRepository.save(floor);
  }

  async findAll(): Promise<FloorEntity[]> {
    return await this.floorRepository.find();
  }

  async findOne(id: number): Promise<FloorEntity> {
    const floor = await this.floorRepository.findOne({ where: { id } });
    if (!floor) throw new NotFoundException(`Floor with ID ${id} not found`);
    return floor;
  }

  async update(
    id: number,
    updateFloorDto: UpdateFloorDTO,
  ): Promise<FloorEntity> {
    await this.findOne(id); // Check if exists
    await this.floorRepository.update(id, updateFloorDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const floor = await this.findOne(id);
    await this.floorRepository.remove(floor);
  }

  async getTotalRoomCount(): Promise<number> {
    const result = await this.floorRepository
      .createQueryBuilder('floor')
      .select('SUM(floor.room_count)', 'total_rooms')
      .getRawOne();

    return result.total_rooms || 0; // Nếu không có dữ liệu, trả về 0
  }
}
