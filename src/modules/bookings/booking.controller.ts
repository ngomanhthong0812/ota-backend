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
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/createBooking.dto';
import { UpdateBookingDto } from './dto/updateBooking.dto';
import { ResponData } from 'src/global/globalClass';
import { HttpMessage, HttpStatus } from 'src/global/globalEnum';
import { Booking } from 'src/models/booking.model';

@Controller('bookings')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  // Lấy tất cả các booking
  @Get()
  async getBookings(): Promise<ResponData<Booking[]>> {
    try {
      const bookings = await this.bookingService.getBookings();
      return new ResponData<Booking[]>(
        bookings,
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponData<Booking[]>(
        null,
        HttpStatus.ERROR,
        HttpMessage.ERROR,
      );
    }
  }

  // Lấy chi tiết booking theo ID
  @Get(':id')
  async getBookingById(@Param('id') id: number): Promise<ResponData<Booking>> {
    try {
      const booking = await this.bookingService.getBookingById(id);
      return new ResponData<Booking>(
        booking,
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponData<Booking>(null, HttpStatus.ERROR, HttpMessage.ERROR);
    }
  }

  // Tạo mới booking
  @Post()
  async createBooking(
    @Body(new ValidationPipe()) createBookingDto: CreateBookingDto,
  ): Promise<ResponData<Booking>> {
    try {
      const booking = await this.bookingService.createBooking(createBookingDto);
      return new ResponData<Booking>(
        booking,
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponData<Booking>(null, HttpStatus.ERROR, HttpMessage.ERROR);
    }
  }

  // Cập nhật booking theo ID
  @Put(':id')
  async updateBooking(
    @Param('id') id: number,
    @Body(new ValidationPipe()) updateBookingDto: UpdateBookingDto,
  ): Promise<ResponData<string>> {
    try {
      const response = await this.bookingService.updateBooking(
        id,
        updateBookingDto,
      );
      return new ResponData<string>(
        response,
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponData<string>(null, HttpStatus.ERROR, HttpMessage.ERROR);
    }
  }

  // Xóa booking theo ID
  @Delete(':id')
  async deleteBooking(@Param('id') id: number): Promise<ResponData<string>> {
    try {
      const response = await this.bookingService.deleteBooking(id);
      return new ResponData<string>(
        response,
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponData<string>(null, HttpStatus.ERROR, HttpMessage.ERROR);
    }
  }
}
