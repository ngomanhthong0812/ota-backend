import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThanOrEqual, Not, In } from 'typeorm';
import { BookingEntity } from 'src/entities/booking.entity';
import { CreateBookingDto } from './dto/createBooking.dto';
import { UpdateBookingDto } from './dto/updateBooking.dto';
import { BookingRoomEntity } from 'src/entities/bookingRoom.entity';
import { RoomEntity, RoomStatus } from 'src/entities/room.entity';
import { CustomerEntity } from 'src/entities/customer.entity';
import { HotelEntity } from 'src/entities/hotel.entity';
import { InvoiceService } from '../invoice/invoice.service';
import { CreateInvoiceDto } from '../invoice/dto/createInvoice.dto';
import { InvoicePayment } from 'src/models/invoicePayment.model';
import { InvoicePaymentService } from '../invoicePayments/invoicePayment.service';
import { CreateInvoicePaymentDto } from '../invoicePayments/dto/createInvoicePayment.dto';

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(BookingEntity)
    private readonly bookingRepository: Repository<BookingEntity>,
    @InjectRepository(BookingRoomEntity)
    private readonly bookingRoomRepository: Repository<BookingRoomEntity>,
    @InjectRepository(RoomEntity)
    private readonly roomRepository: Repository<RoomEntity>,
    @InjectRepository(CustomerEntity)
    private readonly customerRepository: Repository<CustomerEntity>,
    @InjectRepository(HotelEntity)
    private readonly hotelRepository: Repository<HotelEntity>,

    private readonly invoiceService: InvoiceService,
    private readonly InvoicePaymentService: InvoicePaymentService,
  ) {}

  // Lấy tất cả các booking
  async getBookings() {
    return this.bookingRepository.find();
  }

  // Lấy chi tiết booking theo ID
  async getBookingById(id: number) {
    const booking = await this.bookingRepository.findOne({
      where: { id }, // Cập nhật đoạn này
    });

    if (!booking) {
      throw new Error('Booking not found');
    }

    return booking;
  }

  // Tạo mới booking
  async createBooking(dto: CreateBookingDto): Promise<any> {
    try {
      const {
        customer_name,
        customer_phone,
        customer_email,
        customer_gender,
        customer_birthday,
        hotel_id,
        booking_rooms,
        children,
        adults,
        total_amount, // Đây là trường optional, bạn có thể tính toán nếu không có.
        check_in_at,
        check_out_at,
        paidAmount,
        paymentMethod,
      } = dto;

      // Tính toán tổng số tiền nếu không có total_amount
      const calculatedTotalAmount =
        total_amount ||
        booking_rooms.reduce((total, room) => total + room.price, 0);

      // 1. Kiểm tra khách hàng và tạo mới nếu không có
      let customer: CustomerEntity;

      if (customer_name && customer_phone) {
        // Tìm khách hàng theo customer_name và customer_phone
        customer = await this.customerRepository.findOne({
          where: {
            name: customer_name,
            phone: customer_phone,
          },
        });

        if (!customer) {
          console.log(
            `Customer with name ${customer_name} and phone ${customer_phone} does not exist. Creating new customer...`,
          );

          // Kiểm tra khách sạn có tồn tại không
          const hotel = await this.hotelRepository.findOne({
            where: { id: hotel_id },
          });

          if (!hotel) {
            throw new Error(`Hotel with ID ${hotel_id} does not exist.`);
          }

          // Tạo khách hàng mới với thông tin từ DTO
          customer = this.customerRepository.create({
            name: customer_name,
            phone: customer_phone,
            email: customer_email,
            gender: customer_gender,
            birthday: customer_birthday,
            hotel_id,
          });

          // Lưu khách hàng mới vào cơ sở dữ liệu
          customer = await this.customerRepository.save(customer);
          console.log('Created new customer with ID:', customer.id);
        }
      } else {
        throw new Error('Customer name and phone are required.');
      }
      // 2. Kiểm tra phòng
      for (const room of booking_rooms) {
        const roomEntity = await this.roomRepository.findOne({
          where: { id: room.room_id, hotel_id },
        });
        if (!roomEntity) {
          throw new Error(
            `Room with ID ${room.room_id} is not available in the specified hotel.`,
          );
        }
        // Kiểm tra nếu ngày nhận phòng trùng với ngày hiện tại
        const today = new Date();
        const checkInDate = new Date(check_in_at);
        if (
          checkInDate.getFullYear() === today.getFullYear() &&
          checkInDate.getMonth() === today.getMonth() &&
          checkInDate.getDate() === today.getDate()
        ) {
          console.log(
            `Room with ID ${room.room_id} has check-in date today. Updating room status to 'Occupied'...`,
          );

          // Cập nhật trạng thái phòng
          await this.roomRepository.update(
            { id: room.room_id },
            { status: RoomStatus.BOOKED },
          );
        }
      }

      // 3. Tạo booking
      const booking = this.bookingRepository.create({
        customer_id: customer.id,
        hotel_id,
        children,
        adults,
        total_amount: calculatedTotalAmount,
        booking_at: check_in_at,
        check_out_at,
        status: 'Booked', // Mặc định là Booked
      });
      const newBooking = await this.bookingRepository.save(booking);

      // 4. Tạo booking_rooms
      const bookingRooms = booking_rooms.map((room) => {
        return this.bookingRoomRepository.create({
          booking_id: newBooking.id,
          room_id: room.room_id,
          price: room.price,
          price_type: room.price_type,
          hotel_id,
        });
      });
      await this.bookingRoomRepository.save(bookingRooms);
      const invoiceDto: CreateInvoiceDto = {
        total_amount: total_amount,
        discount_amount: 0,
        discount_percentage: 0,
        note_discount: '',
        note: 'Booking payment',
        customer_id: customer.id,
        payment_method: 'Cash',
        status: 'Unpaid',
        booking_id: newBooking.id,
        hotel_id,
      };

      const invoice = await this.invoiceService.createInvoice(invoiceDto);

      if (paidAmount && paidAmount > 0) {
        const invoicePaymentDto: CreateInvoicePaymentDto = {
          amount: paidAmount,
          payment_method: paymentMethod,
          note: `thanh toán trước ${paidAmount}`,
          invoice_id: invoice.id,
        };

        await this.InvoicePaymentService.createInvoicePayment(
          invoicePaymentDto,
        );
      }

      return { newBooking, bookingRooms, customer };
    } catch (error) {
      console.error('Error creating booking:', error);
      throw new Error(`Error creating booking: ${error.message}`);
    }
  }

  // Cập nhật booking theo ID
  async updateBooking(id: number, updateBookingDto: UpdateBookingDto) {
    const booking = await this.getBookingById(id); // Kiểm tra xem booking có tồn tại không
    Object.assign(booking, updateBookingDto); // Cập nhật các trường mới
    await this.bookingRepository.save(booking); // Lưu thay đổi
    return `Update success ${updateBookingDto.status}`;
  }

  // Xóa booking theo ID
  async deleteBooking(id: number) {
    await this.bookingRepository.delete(id);
    return `Delete booking ${id} success`;
  }

  async getbookingRoomsWithCustomerByRoomId(room_id: number): Promise<any[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const bookings = this.bookingRepository.find({
      relations: ['booking_rooms', 'customer'],
      where: {
        booking_rooms: {
          room_id: room_id,
          booking: {
            check_out_at: MoreThanOrEqual(today),
            status: Not('Cancelled'),
          },
        },
      },
    });
    return (await bookings).map((booking) => ({
      id: booking.id,
      booking_at: booking.booking_at,
      check_in_at: booking.check_in_at,
      check_out_at: booking.check_out_at,
      customer: {
        id: booking.customer.id,
        name: booking.customer.name,
      },
    }));
  }

  async getAvailableRooms(
    hotelId: number,
    startDate: Date,
    endDate: Date,
  ): Promise<any[]> {
    try {
      // Bước 1: Lấy tất cả các loại phòng với thông tin đầy đủ, bao gồm các loại giá
      const roomTypes = await this.roomRepository
        .createQueryBuilder('room')
        .leftJoinAndSelect('room.room_type', 'room_type') // Join với bảng room_type để lấy thông tin loại phòng
        .where('room.hotel_id = :hotelId', { hotelId })
        .select([
          'room_type.id AS room_type_id', // ID loại phòng
          'room_type.name AS room_type_name', // Tên loại phòng
          'room_type.notes AS room_type_notes', // Ghi chú loại phòng
          'room_type.standardCapacity AS room_type_standard_capacity', // Sức chứa tiêu chuẩn
          'room_type.maxCapacity AS room_type_max_capacity', // Sức chứa tối đa
          'room_type.standardChildren AS room_type_standard_children', // Sức chứa trẻ em tiêu chuẩn
          'room_type.maxChildren AS room_type_max_children', // Sức chứa tối đa cho trẻ em
          'room_type.hourlyRate AS room_type_hourly_rate', // Giá theo giờ
          'room_type.dailyRate AS room_type_daily_rate', // Giá theo ngày
          'room_type.overnightRate AS room_type_overnight_rate', // Giá qua đêm
        ])
        .distinct(true) // Lọc trùng loại phòng
        .getRawMany();

      // Bước 2: Lấy danh sách các phòng đã được đặt trong khoảng thời gian (booked)
      const bookedRoomIds = await this.bookingRoomRepository
        .createQueryBuilder('bookingRoom')
        .leftJoinAndSelect('bookingRoom.booking', 'booking')
        .where('booking.hotel_id = :hotelId', { hotelId })
        .andWhere('booking.status IN (:...statuses)', {
          statuses: ['Booked', 'CheckedIn'],
        })
        .andWhere(
          `NOT (
            booking.check_out_at <= :startDate OR 
            booking.booking_at >= :endDate
          )`,
          { startDate, endDate },
        )
        .select('bookingRoom.room_id')
        .getRawMany();

      // Lấy danh sách ID phòng đã được đặt
      const bookedRoomIdsList = bookedRoomIds.map(
        (room) => room.bookingRoom_room_id,
      );

      // Bước 3: Lọc các phòng chưa được đặt theo từng loại phòng và lấy thông tin
      const availableRooms = [];

      for (const roomType of roomTypes) {
        // Lấy tổng số phòng trong loại phòng
        const totalRooms = await this.roomRepository
          .createQueryBuilder('room')
          .where('room.hotel_id = :hotelId', { hotelId })
          .andWhere('room.room_type_id = :roomTypeId', {
            roomTypeId: roomType.room_type_id,
          })
          .getCount(); // Sử dụng getCount() để đếm tổng số phòng

        // Lấy các phòng chưa được đặt
        const queryBuilder = this.roomRepository
          .createQueryBuilder('room')
          .where('room.hotel_id = :hotelId', { hotelId })
          .andWhere('room.room_type_id = :roomTypeId', {
            roomTypeId: roomType.room_type_id,
          })
          .addSelect([
            'room.id AS room_id', // ID phòng
            'room.name AS room_name', // Tên phòng
          ]);

        // Nếu danh sách phòng đã được đặt không rỗng, thêm điều kiện NOT IN
        if (bookedRoomIdsList.length > 0) {
          queryBuilder.andWhere('room.id NOT IN (:...bookedRoomIds)', {
            bookedRoomIds: bookedRoomIdsList,
          });
        }

        const roomsForType = await queryBuilder.getRawMany();

        // Thêm thông tin vào kết quả
        availableRooms.push({
          id: roomType.room_type_id,
          name: roomType.room_type_name,
          standard_capacity: roomType.room_type_standard_capacity,
          max_capacity: roomType.room_type_max_capacity,
          standard_children: roomType.room_type_standard_children,
          max_children: roomType.room_type_max_children,
          hourly_rate: roomType.room_type_hourly_rate, // Giá theo giờ
          daily_rate: roomType.room_type_daily_rate, // Giá theo ngày
          overnight_rate: roomType.room_type_overnight_rate, // Giá qua đêm
          total_rooms: totalRooms, // Tổng số phòng trong loại phòng này
          available_rooms: roomsForType.length, // Số phòng chưa được đặt
          rooms: roomsForType, // Thêm danh sách các phòng chưa được đặt vào kết quả
        });
      }

      return availableRooms;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getRoomTypes(
    hotelId: number = 1, // Đặt giá trị mặc định cho hotelId là 1
  ): Promise<any[]> {
    try {
      // Bước 1: Lấy tất cả các loại phòng với thông tin đầy đủ, bao gồm các loại giá
      const roomTypes = await this.roomRepository
        .createQueryBuilder('room')
        .leftJoinAndSelect('room.room_type', 'room_type') // Join với bảng room_type để lấy thông tin loại phòng
        .where('room.hotel_id = :hotelId', { hotelId })
        .select([
          'room_type.id AS room_type_id', // ID loại phòng
          'room_type.name AS room_type_name', // Tên loại phòng
          'room_type.notes AS room_type_notes', // Ghi chú loại phòng
          'room_type.standardCapacity AS room_type_standard_capacity', // Sức chứa tiêu chuẩn
          'room_type.maxCapacity AS room_type_max_capacity', // Sức chứa tối đa
          'room_type.standardChildren AS room_type_standard_children', // Sức chứa trẻ em tiêu chuẩn
          'room_type.maxChildren AS room_type_max_children', // Sức chứa tối đa cho trẻ em
          'room_type.hourlyRate AS room_type_hourly_rate', // Giá theo giờ
          'room_type.dailyRate AS room_type_daily_rate', // Giá theo ngày
          'room_type.overnightRate AS room_type_overnight_rate', // Giá qua đêm
        ])
        .distinct(true) // Lọc trùng loại phòng
        .getRawMany();

      // Bước 2: Lấy danh sách các phòng đã được đặt (booked)
      const bookedRoomIds = await this.bookingRoomRepository
        .createQueryBuilder('bookingRoom')
        .leftJoinAndSelect('bookingRoom.booking', 'booking')
        .where('booking.hotel_id = :hotelId', { hotelId })
        .andWhere('booking.status IN (:...statuses)', {
          statuses: ['Booked', 'CheckedIn'],
        })
        .select('bookingRoom.room_id')
        .getRawMany();

      // Lấy danh sách ID phòng đã được đặt
      const bookedRoomIdsList = bookedRoomIds.map(
        (room) => room.bookingRoom_room_id,
      );

      // Bước 3: Lọc các phòng chưa được đặt theo từng loại phòng và lấy thông tin
      const availableRooms = [];

      for (const roomType of roomTypes) {
        // Lấy tổng số phòng trong loại phòng
        const totalRooms = await this.roomRepository
          .createQueryBuilder('room')
          .where('room.hotel_id = :hotelId', { hotelId })
          .andWhere('room.room_type_id = :roomTypeId', {
            roomTypeId: roomType.room_type_id,
          })
          .getCount(); // Sử dụng getCount() để đếm tổng số phòng

        // Lấy các phòng chưa được đặt
        const queryBuilder = this.roomRepository
          .createQueryBuilder('room')
          .where('room.hotel_id = :hotelId', { hotelId })
          .andWhere('room.room_type_id = :roomTypeId', {
            roomTypeId: roomType.room_type_id,
          })
          .addSelect([
            'room.id AS room_id', // ID phòng
            'room.name AS room_name', // Tên phòng
          ]);

        // Nếu danh sách phòng đã được đặt không rỗng, thêm điều kiện NOT IN
        if (bookedRoomIdsList.length > 0) {
          queryBuilder.andWhere('room.id NOT IN (:...bookedRoomIds)', {
            bookedRoomIds: bookedRoomIdsList,
          });
        }

        const roomsForType = await queryBuilder.getRawMany();

        // Thêm thông tin vào kết quả
        availableRooms.push({
          id: roomType.room_type_id,
          name: roomType.room_type_name,
          standard_capacity: roomType.room_type_standard_capacity,
          max_capacity: roomType.room_type_max_capacity,
          standard_children: roomType.room_type_standard_children,
          max_children: roomType.room_type_max_children,
          hourly_rate: roomType.room_type_hourly_rate, // Giá theo giờ
          daily_rate: roomType.room_type_daily_rate, // Giá theo ngày
          overnight_rate: roomType.room_type_overnight_rate, // Giá qua đêm
          total_rooms: totalRooms, // Tổng số phòng trong loại phòng này
          available_rooms: roomsForType.length, // Số phòng chưa được đặt
          rooms: roomsForType, // Thêm danh sách các phòng chưa được đặt vào kết quả
        });
      }

      return availableRooms;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getBookingHistory(hotelId: number): Promise<any[]> {
    const rawData = await this.bookingRepository
      .createQueryBuilder('booking')
      .leftJoinAndSelect('booking.customer', 'customer')
      .leftJoinAndSelect('booking.booking_rooms', 'booking_room')
      .leftJoinAndSelect('booking_room.room', 'room')
      .leftJoinAndSelect('room.room_type', 'room_type')
      .leftJoinAndSelect('booking.invoices', 'invoice')
      .leftJoinAndSelect('invoice.invoice_payments', 'invoice_payment') // Lấy các khoản thanh toán từ hóa đơn
      .where('booking.hotel_id = :hotelId', { hotelId })
      .select([
        'booking.id AS booking_id',
        'booking.status AS booking_status',
        'booking.booking_at AS booking_time',
        'booking.check_out_at AS check_out_at', // Thêm check_out_at
        'customer.name AS customer_name',
        'room.name AS room_name',
        'room_type.code AS room_type_code',
        'room_type.name AS room_type_name',
        'booking_room.price AS room_price',
        'booking.total_amount AS booking_total_amount',
        'invoice_payment.amount AS paid_amount', // Tiền khách đã trả
        'invoice.total_amount AS total_amount',
      ])
      .orderBy('booking.booking_at', 'DESC') // Sắp xếp theo ngày đặt từ cao đến thấp
      .getRawMany();

    // Bảo toàn thứ tự sau khi nhóm dữ liệu
    const groupedData = new Map<number, any>();

    rawData.forEach((item) => {
      const {
        booking_id,
        booking_status,
        booking_time,
        check_out_at,
        customer_name,
        room_name,
        room_type_code,
        room_type_name,
        room_price,
        paid_amount,
        total_amount,
      } = item;

      // Tính số đêm giữa thời gian đặt và check-out
      const checkInDate = new Date(booking_time);
      const checkOutDate = new Date(check_out_at);
      const diffTime = Math.abs(checkOutDate.getTime() - checkInDate.getTime());
      const nightCount = Math.ceil(diffTime / (1000 * 3600 * 24)); // Chuyển đổi ra số đêm

      // Tính tổng tiền của phòng: room_price * nightCount
      const roomTotalAmount = room_price * nightCount;

      if (!groupedData.has(booking_id)) {
        groupedData.set(booking_id, {
          booking_id,
          booking_status,
          booking_time,
          check_out_at,
          customer_name,
          total_amount,
          paid_amount: paid_amount || 0,
          total_amount_to_pay: total_amount - paid_amount,
          rooms: [],
        });
      }

      groupedData.get(booking_id).rooms.push({
        room_name,
        room_type_code,
        room_type_name,
        room_price,
        room_total_amount: roomTotalAmount, // Thêm tổng tiền của phòng vào kết quả
        room_night_count: nightCount, // Thêm số ngày vào phòng
      });
    });

    // Trả về danh sách với thứ tự bảo toàn từ `rawData`
    return Array.from(groupedData.values());
  }
}
