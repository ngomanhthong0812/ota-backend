import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'; // Ensure this import is correct
import { Repository } from 'typeorm'; // Ensure this import is correct
import { BookingRoomEntity } from 'src/entities/bookingRoom.entity'; // Chỉnh sửa đường dẫn nếu cần
import { CreateBookingRoomDto } from './dto/creatBookingRoom';
import { UpdateBookingRoomDto } from './dto/updateBookingRoom';

@Injectable()
export class BookingRoomService {
  constructor(
    @InjectRepository(BookingRoomEntity)
    private readonly bookingRoomRepository: Repository<BookingRoomEntity>, // Now the Repository type is correctly recognized
  ) {}

  // Create a new booking room
  async create(
    createBookingRoomDto: CreateBookingRoomDto,
  ): Promise<BookingRoomEntity> {
    const bookingRoom = this.bookingRoomRepository.create(createBookingRoomDto); // Create entity instance
    return await bookingRoom.save(); // Save entity to database
  }

  // Get all booking rooms
  async getAll(): Promise<BookingRoomEntity[]> {
    return await this.bookingRoomRepository.find();
  }

  // Get booking room by ID
  async getById(id: number): Promise<BookingRoomEntity> {
    return await this.bookingRoomRepository.findOne({ where: { id } });
  }

  // Update booking room by ID
  async update(
    id: number,
    updateBookingRoomDto: UpdateBookingRoomDto,
  ): Promise<BookingRoomEntity> {
    await this.bookingRoomRepository.update(id, updateBookingRoomDto); // Update entity in DB
    return await this.bookingRoomRepository.findOne({ where: { id } }); // Return updated entity
  }

  // Delete booking room by ID
  async delete(id: number): Promise<void> {
    await this.bookingRoomRepository.delete(id); // Delete entity from DB
  }
}
