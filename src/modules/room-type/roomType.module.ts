import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HotelEntity } from 'src/entities/hotel.entity';
import { RoomTypeEntity } from 'src/entities/roomType.entity';
import { RoomTypeService } from './roomType.service';
import { RoomTypeController } from './roomType.controller';
import { UserEntity } from 'src/entities/user.entity';
import { RoomEntity } from 'src/entities/room.entity';
import { FloorEntity } from 'src/entities/floor.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      RoomTypeEntity,
      HotelEntity,
      UserEntity,
      RoomEntity,
      FloorEntity,
    ]),
  ],
  providers: [RoomTypeService],
  controllers: [RoomTypeController],
})
export class RoomTypeModule {}
