import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ServiceEntity } from 'src/entities/service.entity';
import { Service } from 'src/models/service.model';
import { Repository } from 'typeorm';
import { CreateServiceDto } from './dto/createService.dto';
import { UpdateServiceDto } from './dto/updateService.dto';

@Injectable()
export class ServiceService {
  constructor(
    @InjectRepository(ServiceEntity)
    private readonly serviceRepository: Repository<ServiceEntity>,
  ) {}

  async getServices(): Promise<Service[]> {
    const services = await this.serviceRepository.find();
    return services.map(
      (service) =>
        new Service(
          service.id,
          service.name,
          service.description,
          service.unit_price,
          service.category_id,
        ),
    );
  }

  async findOneService(id: number): Promise<Service> {
    const service = await this.serviceRepository.findOne({ where: { id } });
    return new Service(
      service.id,
      service.name,
      service.description,
      service.unit_price,
      service.category_id,
    );
  }

  async createService(createServiceDto: CreateServiceDto): Promise<Service> {
    const service = new Service();
    service.name = createServiceDto.name;
    service.description = createServiceDto.description;
    service.unit_price = createServiceDto.unit_price;
    service.category_id = createServiceDto.category_id;

    await this.serviceRepository.save(service);
    return new Service(
      service.id,
      service.name,
      service.description,
      service.unit_price,
      service.category_id,
    );
  }

  async updateService(updateServiceDto: UpdateServiceDto): Promise<Service> {
    const { id, ...updateServiceData } = updateServiceDto;

    await this.serviceRepository.update(id, updateServiceData);

    const service = await this.serviceRepository.findOne({ where: { id } });
    return new Service(
      service.id,
      service.name,
      service.description,
      service.unit_price,
      service.category_id,
    );
  }

  async deleteService(id: number): Promise<string> {
    await this.serviceRepository.delete(id);
    return `Delete service ${id} success`;
  }
}
