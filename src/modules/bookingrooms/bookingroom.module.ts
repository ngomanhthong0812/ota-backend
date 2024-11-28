import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingRoomService } from './bookingroom.service';
import { BookingRoomController } from './bookingroom.controller';
import { BookingRoomEntity } from 'src/entities/bookingRoom.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BookingRoomEntity])],
  providers: [BookingRoomService],
  controllers: [BookingRoomController],
})
export class BookingRoomModule {}
