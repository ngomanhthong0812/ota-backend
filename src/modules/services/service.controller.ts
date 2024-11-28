import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  ValidationPipe,
} from '@nestjs/common';
import { ServiceService } from './service.service';
import { HttpMessage, HttpStatus } from 'src/global/globalEnum';
import { ResponData } from 'src/global/globalClass';
import { Service } from 'src/models/service.model';
import { CreateServiceDto } from './dto/createService.dto';
import { UpdateServiceDto } from './dto/updateService.dto';

@Controller('services')
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) {}

  @Get()
  async getServices(): Promise<ResponData<Service[]>> {
    try {
      return new ResponData<Service[]>(
        await this.serviceService.getServices(),
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponData<Service[]>(
        await this.serviceService.getServices(),
        HttpStatus.ERROR,
        HttpMessage.ERROR,
      );
    }
  }

  @Get(':id')
  async findOneService(@Param('id') id: number): Promise<ResponData<Service>> {
    try {
      return new ResponData<Service>(
        await this.serviceService.findOneService(id),
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponData<Service>(null, HttpStatus.ERROR, HttpMessage.ERROR);
    }
  }

  @Post()
  async createService(
    @Body(new ValidationPipe()) createServiceDto: CreateServiceDto,
  ): Promise<ResponData<Service>> {
    try {
      return new ResponData<Service>(
        await this.serviceService.createService(createServiceDto),
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponData<Service>(null, HttpStatus.ERROR, HttpMessage.ERROR);
    }
  }

  @Put()
  async updateService(
    @Body(new ValidationPipe()) updateServiceDto: UpdateServiceDto,
  ): Promise<ResponData<Service>> {
    try {
      return new ResponData<Service>(
        await this.serviceService.updateService(updateServiceDto),
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponData<Service>(null, HttpStatus.ERROR, HttpMessage.ERROR);
    }
  }

  @Delete(':id')
  async deleteService(@Param('id') id: number): Promise<ResponData<string>> {
    try {
      return new ResponData<string>(
        await this.serviceService.deleteService(id),
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponData<string>(null, HttpStatus.ERROR, HttpMessage.ERROR);
    }
  }
}
