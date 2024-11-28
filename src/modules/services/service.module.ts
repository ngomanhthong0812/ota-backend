import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceEntity } from 'src/entities/service.entity';
import { ServiceController } from './service.controller';
import { ServiceService } from './service.service';

@Module({
  imports: [TypeOrmModule.forFeature([ServiceEntity])],
  controllers: [ServiceController],
  providers: [ServiceService],
})
export class ServiceModule {}
