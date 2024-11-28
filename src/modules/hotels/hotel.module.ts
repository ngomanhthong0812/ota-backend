import { Module } from '@nestjs/common';
import { HotelController } from './hotel.controller';
import { HotelService } from './hotel.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HotelEntity } from 'src/entities/hotel.entity';

@Module({
  imports: [TypeOrmModule.forFeature([HotelEntity])],
  controllers: [HotelController],
  providers: [HotelService],
  exports: [HotelService],
})
export class HotelModule {}
