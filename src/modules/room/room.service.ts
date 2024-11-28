import { InjectRepository } from '@nestjs/typeorm';
import { RoomEntity } from 'src/entities/room.entity';
import { Repository } from 'typeorm';
import { CreateRoomDto } from './dto/createRoom.dto';
import { RoomTypeEntity } from 'src/entities/roomType.entity';
import { HotelEntity } from 'src/entities/hotel.entity';
import { HttpException } from '@nestjs/common';
import { HttpStatus } from 'src/global/globalEnum';
import { UpdateRoomDto } from './dto/updateRoom.dto';

export class RoomService {
  constructor(
    @InjectRepository(RoomEntity)
    private roomRepository: Repository<RoomEntity>,
    @InjectRepository(RoomTypeEntity)
    private readonly roomTypeRepository: Repository<RoomTypeEntity>,

    @InjectRepository(HotelEntity)
    private readonly hotelRepository: Repository<HotelEntity>,
  ) {}
  //tạo phòng
  async createRoom(CreateRoomDto: CreateRoomDto): Promise<CreateRoomDto> {
    // Sử dụng cú pháp đúng để tìm phòng theo room_type_id
    const roomType = await this.roomTypeRepository.findOne({
      where: { id: CreateRoomDto.room_type_id },
    });

    if (!roomType) {
      throw new HttpException(` room_type_id không tồn tại`, HttpStatus.ERROR);
    }

    // Kiểm tra xem hotel_id có hợp lệ không
    const hotel = await this.hotelRepository.findOne({
      where: { id: CreateRoomDto.hotel_id },
    });

    if (!hotel) {
      throw new HttpException(`hotel_id không tồn tại`, HttpStatus.ERROR);
    }

    // Tạo đối tượng phòng từ DTO
    const room = this.roomRepository.create(CreateRoomDto);

    // Lưu phòng vào cơ sở dữ liệu
    return await this.roomRepository.save(room);
  }
  //   update
  async updateRoom(id: number, updateRoomDto: UpdateRoomDto): Promise<any> {
    // Tìm phòng theo ID
    const room = await this.roomRepository.findOne({ where: { id } });
    if (!room) {
      return `Room with ID ${id} not found`;
    }

    // Cập nhật thông tin phòng
    Object.assign(room, updateRoomDto);
    const updatedRoom = await this.roomRepository.save(room);

    return updatedRoom;
  }
  //   xóa
  async deleteRoom(id: number): Promise<string> {
    // Tìm phòng theo ID
    const room = await this.roomRepository.findOne({ where: { id } });
    if (!room) {
      return `Room with ID ${id} not found`;
    }

    // Xóa phòng
    await this.roomRepository.remove(room);

    return `Room with ID ${id} deleted successfully`;
  }
  //   lấy 1 room
  async getRoom(id: number): Promise<any> {
    // Tìm phòng theo ID
    const room = await this.roomRepository.findOne({ where: { id } });
    if (!room) {
      return `Room with ID ${id} not found`;
    }

    return room;
  }
  //   lấy tất cả
  async getAllRooms(): Promise<any> {
    return await this.roomRepository.find();
  }

  async getTypeRoomWithPrice(): Promise<any> {
    const rooms = await this.roomRepository.find({
      relations: [
        'room_type', // Liên kết với RoomType
        'floor', // Liên kết với Floor
        'hotel', // Liên kết với Hotel
        'booking_rooms', // Liên kết với BookingRoom
        'booking_rooms.booking', // Liên kết với BookingEntity để lấy check_in_at, check_out_at
      ],
    });

    return rooms.map((room) => ({
      room_type_id: room.room_type?.id,
      price: room.price,
      room_type: room.room_type?.name, // Lấy tên loại phòng
    }));
  }

  async getAllRoomsWithBookings(): Promise<any> {
    const rooms = await this.roomRepository.find({
      relations: [
        'room_type', // Liên kết với RoomType
        'floor', // Liên kết với Floor
        'hotel', // Liên kết với Hotel
        'booking_rooms', // Liên kết với BookingRoom
        'booking_rooms.booking', // Liên kết với BookingEntity để lấy check_in_at, check_out_at
      ],
    });

    return rooms.map((room) => ({
      id: room.id,
      name: room.name,
      clean_status: room.clean_status,
      status: room.status,
      price: room.price,
      room_type: room.room_type?.name, // Lấy tên loại phòng
      floor: room.floor?.name, // Lấy tên tầng
      hotel: room.hotel?.name, // Lấy tên khách sạn
      bookings: room.booking_rooms.map((bookingRoom) => ({
        id: bookingRoom.booking.id,
        check_in_at: bookingRoom.booking.check_in_at,
        check_out_at: bookingRoom.booking.check_out_at,
        status: bookingRoom.booking.status,
      })),
    }));
  }

  async getAllRoomsWithBookingsToday(): Promise<any> {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Đặt giờ thành 00:00:00 để so sánh với ngày hôm nay
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1); // Ngày mai (sử dụng để so sánh với ngày hôm nay)

      // Ngày hôm qua
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1); // Ngày hôm qua

      // Lấy tất cả các phòng cùng với thông tin booking
      const rooms = await this.roomRepository.find({
        relations: [
          'room_type',
          'floor',
          'hotel',
          'booking_rooms',
          'booking_rooms.booking',
        ],
        order: {
          name: 'ASC',
        },
      });

      const allRooms = [];

      rooms.forEach((room) => {
        // Lọc các booking của phòng, chỉ lấy booking có check_in_at là hôm nay
        const bookingsToday = room.booking_rooms.filter((bookingRoom) => {
          const checkInDate = new Date(bookingRoom.booking.check_in_at);
          return checkInDate >= today && checkInDate < tomorrow;
        });

        // Lọc các booking của phòng, chỉ lấy booking có check_in_at là hôm qua và check_out_at chưa qua hôm nay
        const bookingsInUse = room.booking_rooms.filter((bookingRoom) => {
          const checkInDate = new Date(bookingRoom.booking.check_in_at);
          const checkOutDate = new Date(bookingRoom.booking.check_out_at);
          return (
            checkInDate >= yesterday &&
            checkInDate < today &&
            checkOutDate >= today
          );
        });

        const roomData = {
          id: room.id,
          name: room.name,
          clean_status: room.clean_status,
          status: room.status, // Phòng đã đặt hoặc trống
          price: room.price,
          room_type: room.room_type?.name,
          floor: room.floor,
          hotel: room.hotel?.name,
          bookings:
            bookingsToday.length > 0 || bookingsInUse.length > 0
              ? [...bookingsToday, ...bookingsInUse].map((bookingRoom) => ({
                  id: bookingRoom.booking.id,
                  check_in_at: bookingRoom.booking.check_in_at,
                  check_out_at: bookingRoom.booking.check_out_at,
                  status: bookingRoom.booking.status,
                }))
              : null, // Nếu không có booking nào thì trả về null
        };

        allRooms.push(roomData);
      });

      return allRooms;
    } catch (error) {
      console.error('Error fetching room status for today:', error);
      throw new Error('Unable to fetch room status for today');
    }
  }
}
