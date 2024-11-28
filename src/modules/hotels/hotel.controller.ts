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
import { ResponData } from 'src/global/globalClass';
import { Hotel } from 'src/models/hotel.model';
import { HotelService } from './hotel.service';
import { HttpMessage, HttpStatus } from 'src/global/globalEnum';
import { CreateHotelDto } from './dto/createHotel.dto';
import { UpdateHotelDto } from './dto/updateHotel.dto';

@Controller('hotels')
export class HotelController {
  constructor(private readonly hotelService: HotelService) {}

  @Get()
  async getHotels(): Promise<ResponData<Hotel[]>> {
    try {
      return new ResponData<Hotel[]>(
        await this.hotelService.getHotels(),
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponData<Hotel[]>(null, HttpStatus.ERROR, HttpMessage.ERROR);
    }
  }

  @Get(':id')
  async findOneHotel(@Param('id') id: number): Promise<ResponData<Hotel>> {
    try {
      return new ResponData<Hotel>(
        await this.hotelService.findOneHotel(id),
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponData<Hotel>(null, HttpStatus.ERROR, HttpMessage.ERROR);
    }
  }

  @Post()
  async createHotel(
    @Body(new ValidationPipe()) createHotelDto: CreateHotelDto,
  ): Promise<ResponData<Hotel>> {
    try {
      return new ResponData<Hotel>(
        await this.hotelService.createHotel(createHotelDto),
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      if (error.message) {
        return new ResponData<Hotel>(null, HttpStatus.ERROR, error.message);
      }
      return new ResponData<Hotel>(null, HttpStatus.ERROR, HttpMessage.ERROR);
    }
  }

  @Put()
  async updateHotel(
    @Body(new ValidationPipe()) updateHotelDto: UpdateHotelDto,
  ): Promise<ResponData<Hotel>> {
    try {
      return new ResponData<Hotel>(
        await this.hotelService.updateHotel(updateHotelDto),
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      if (error.message) {
        return new ResponData<Hotel>(null, HttpStatus.ERROR, error.message);
      }
      return new ResponData<Hotel>(null, HttpStatus.ERROR, HttpMessage.ERROR);
    }
  }

  @Delete(':id')
  async deleteHotel(@Param('id') id: number): Promise<ResponData<string>> {
    try {
      return new ResponData<string>(
        await this.hotelService.deleteHotel(id),
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponData<string>(null, HttpStatus.ERROR, HttpMessage.ERROR);
    }
  }
}
