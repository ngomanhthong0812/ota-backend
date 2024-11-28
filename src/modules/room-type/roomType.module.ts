import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HotelEntity } from 'src/entities/hotel.entity';
import { RoomTypeEntity } from 'src/entities/roomType.entity';
import { RoomTypeService } from './roomType.service';
import { RoomTypeController } from './roomType.controller';

@Module({
  imports: [TypeOrmModule.forFeature([RoomTypeEntity, HotelEntity])],
  providers: [RoomTypeService],
  controllers: [RoomTypeController],
})
export class RoomTypeModule {}
