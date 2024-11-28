import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HotelEntity } from 'src/entities/hotel.entity';
import { Hotel } from 'src/models/hotel.model';
import { Repository } from 'typeorm';
import { CreateHotelDto } from './dto/createHotel.dto';
import { UpdateHotelDto } from './dto/updateHotel.dto';

@Injectable()
export class HotelService {
  constructor(
    @InjectRepository(HotelEntity)
    private readonly hotelRepository: Repository<HotelEntity>,
  ) {}

  isNameExist = async (name: string) => {
    const hotel = await this.hotelRepository.findOne({ where: { name } });
    if (hotel) return true;
    return false;
  };
  isAddressExist = async (address: string) => {
    const hotel = await this.hotelRepository.findOne({ where: { address } });
    if (hotel) return true;
    return false;
  };
  isPhoneExist = async (phone: string) => {
    const hotel = await this.hotelRepository.findOne({ where: { phone } });
    if (hotel) return true;
    return false;
  };
  isEmailExist = async (email: string) => {
    const hotel = await this.hotelRepository.findOne({ where: { email } });
    if (hotel) return true;
    return false;
  };

  async getHotels(): Promise<Hotel[]> {
    const hotels = await this.hotelRepository.find();
    return hotels.map(
      (hotel) =>
        new Hotel(
          hotel.id,
          hotel.name,
          hotel.address,
          hotel.phone,
          hotel.email,
        ),
    );
  }

  async findOneHotel(id: number): Promise<Hotel> {
    const hotel = await this.hotelRepository.findOne({ where: { id: id } });
    return new Hotel(
      hotel.id,
      hotel.name,
      hotel.address,
      hotel.phone,
      hotel.email,
    );
  }

  async createHotel(createHotelDto: CreateHotelDto): Promise<Hotel> {
    const hotel = new Hotel();
    hotel.name = createHotelDto.name;
    hotel.email = createHotelDto.email;
    if (createHotelDto.address) hotel.address = createHotelDto.address;
    if (createHotelDto.phone) hotel.phone = createHotelDto.phone;

    if (await this.isNameExist(hotel.name)) {
      throw new Error('Tên khách sạn đã được sử dụng!');
    }
    if (hotel.address && (await this.isAddressExist(hotel.address))) {
      throw new Error('Địa chỉ khách sạn đã được sử dụng!');
    }
    if (hotel.phone && (await this.isPhoneExist(hotel.phone))) {
      throw new Error('Số điện thoại khách sạn đã được sử dụng!');
    }
    if (await this.isEmailExist(hotel.email)) {
      throw new Error('Email khách sạn đã được sử dụng!');
    }

    await this.hotelRepository.save(hotel);

    return new Hotel(
      hotel.id,
      hotel.name,
      hotel.address,
      hotel.phone,
      hotel.email,
    );
  }

  async updateHotel(updateHotelDto: UpdateHotelDto): Promise<Hotel> {
    const { id, ...updateHotelData } = updateHotelDto;

    if (
      updateHotelData.name &&
      (await this.isNameExist(updateHotelData.name))
    ) {
      throw new Error('Tên khách sạn đã được sử dụng!');
    }
    if (
      updateHotelData.address &&
      (await this.isAddressExist(updateHotelData.address))
    ) {
      throw new Error('Địa chỉ khách sạn đã được sử dụng!');
    }
    if (
      updateHotelData.phone &&
      (await this.isPhoneExist(updateHotelData.phone))
    ) {
      throw new Error('Số điện thoại khách sạn đã được sử dụng!');
    }
    if (
      updateHotelData.email &&
      (await this.isEmailExist(updateHotelData.email))
    ) {
      throw new Error('Email khách sạn đã được sử dụng!');
    }

    await this.hotelRepository.update(id, updateHotelData);
    const hotel = await this.findOneHotel(id);

    return new Hotel(
      hotel.id,
      hotel.name,
      hotel.address,
      hotel.phone,
      hotel.email,
    );
  }

  async deleteHotel(id: number): Promise<string> {
    await this.hotelRepository.delete(id);
    return `Delete hotel ${id} success`;
  }

  async createHotelRegister(
    name_hotel: string,
    email: string,
  ): Promise<number> {
    const hotel = new Hotel();
    hotel.name = name_hotel;
    hotel.email = email;

    const savedHotel = await this.hotelRepository.save(hotel);

    return savedHotel.id;
  }
}
