import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CustomerEntity } from 'src/entities/customer.entity';
import { Customer } from 'src/models/customer.model';
import { Repository } from 'typeorm';
import { CreateCustomerDto } from './dto/createCustomer.dto';
import { UpdateCustomerDto } from './dto/updateCustomer.dto';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(CustomerEntity)
    private readonly customerRepository: Repository<CustomerEntity>,
  ) {}

  async getCustomers(): Promise<Customer[]> {
    const customers = await this.customerRepository.find();
    return customers.map(
      (customer) =>
        new Customer(
          customer.id,
          customer.birthday,
          customer.phone,
          customer.email,
          customer.gender,
          customer.hotel_id,
        ),
    );
  }

  async createCustomer(
    createCustomerDto: CreateCustomerDto,
  ): Promise<Customer> {
    const customer = this.customerRepository.create({
      ...createCustomerDto,
    });
    await this.customerRepository.save(customer);
    return new Customer(
      customer.id,
      customer.birthday,
      customer.phone,
      customer.email,
      customer.gender,
      customer.hotel_id,
    );
  }

  async getDetailCustomer(id: number): Promise<Customer> {
    const customer = await this.customerRepository.findOne({ where: { id } });
    if (!customer) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }
    return new Customer(
      customer.id,
      customer.birthday,
      customer.phone,
      customer.email,
      customer.gender,
      customer.hotel_id,
    );
  }

  async updateCustomer(id: number, updateCustomerDto: UpdateCustomerDto) {
    const customer = await this.getDetailCustomer(id);
    Object.assign(customer, updateCustomerDto);
    await this.customerRepository.save(customer);
    return 'Update success';
  }

  async deleteCustomer(id: number): Promise<string> {
    const result = await this.customerRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }
    return `Delete customer ${id} success`;
  }
}
