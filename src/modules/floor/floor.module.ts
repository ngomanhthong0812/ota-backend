import { TypeOrmModule } from '@nestjs/typeorm';
import { FloorEntity } from '@src/entities/floor.entity';
import { FloorController } from './floor.controller';
import { FloorService } from './floor.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [TypeOrmModule.forFeature([FloorEntity])],
  controllers: [FloorController],
  providers: [FloorService],
})
export class FloorModule {}
