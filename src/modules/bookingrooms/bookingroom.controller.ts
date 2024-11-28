import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { BookingRoomService } from './bookingroom.service';
import { CreateBookingRoomDto } from './dto/creatBookingRoom';
import { UpdateBookingRoomDto } from './dto/updateBookingRoom';
import { ResponData } from 'src/global/globalClass';
import { HttpMessage, HttpStatus } from 'src/global/globalEnum';
import { BookingRoomEntity } from 'src/entities/bookingRoom.entity';

@Controller('bookingrooms')
export class BookingRoomController {
  constructor(private readonly bookingRoomService: BookingRoomService) {}

  @Get()
  async getAllBookingRooms(): Promise<ResponData<BookingRoomEntity[]>> {
    const bookingRooms = await this.bookingRoomService.getAll();
    return new ResponData<BookingRoomEntity[]>(
      bookingRooms,
      HttpStatus.SUCCESS,
      HttpMessage.SUCCESS,
    );
  }

  @Get(':id')
  async getBookingRoomById(
    @Param('id') id: number,
  ): Promise<ResponData<BookingRoomEntity>> {
    const bookingRoom = await this.bookingRoomService.getById(id);
    return new ResponData<BookingRoomEntity>(
      bookingRoom,
      HttpStatus.SUCCESS,
      HttpMessage.SUCCESS,
    );
  }

  @Post()
  async createBookingRoom(
    @Body() createBookingRoomDto: CreateBookingRoomDto,
  ): Promise<ResponData<BookingRoomEntity>> {
    const bookingRoom =
      await this.bookingRoomService.create(createBookingRoomDto);
    return new ResponData<BookingRoomEntity>(
      bookingRoom,
      HttpStatus.SUCCESS,
      HttpMessage.SUCCESS,
    );
  }

  @Put(':id')
  async updateBookingRoom(
    @Param('id') id: number,
    @Body() updateBookingRoomDto: UpdateBookingRoomDto,
  ): Promise<ResponData<BookingRoomEntity>> {
    const bookingRoom = await this.bookingRoomService.update(
      id,
      updateBookingRoomDto,
    );
    return new ResponData<BookingRoomEntity>(
      bookingRoom,
      HttpStatus.SUCCESS,
      HttpMessage.SUCCESS,
    );
  }

  @Delete(':id')
  async deleteBookingRoom(
    @Param('id') id: number,
  ): Promise<ResponData<string>> {
    await this.bookingRoomService.delete(id);
    return new ResponData<string>(
      'Booking room deleted successfully',
      HttpStatus.SUCCESS,
      HttpMessage.SUCCESS,
    );
  }
}
