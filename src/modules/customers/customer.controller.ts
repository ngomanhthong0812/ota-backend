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
import { HttpMessage, HttpStatus } from 'src/global/globalEnum';
import { CustomerService } from './customer.service';
import { Customer } from 'src/models/customer.model';
import { CreateCustomerDto } from './dto/createCustomer.dto';
import { UpdateCustomerDto } from './dto/updateCustomer.dto';

@Controller('customers')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Get()
  async getCustomers(): Promise<ResponData<Customer[]>> {
    try {
      const customers = await this.customerService.getCustomers();
      return new ResponData<Customer[]>(
        customers,
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponData<Customer[]>(
        null,
        HttpStatus.ERROR,
        HttpMessage.ERROR,
      );
    }
  }

  @Get(':id')
  async getDetailCustomer(
    @Param('id') id: number,
  ): Promise<ResponData<Customer>> {
    try {
      const customer = await this.customerService.getDetailCustomer(id);
      return new ResponData<Customer>(
        customer,
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponData<Customer>(
        null,
        HttpStatus.ERROR,
        HttpMessage.ERROR,
      );
    }
  }

  @Post()
  async createCustomer(
    @Body(new ValidationPipe()) createCustomerDto: CreateCustomerDto,
  ): Promise<ResponData<Customer>> {
    try {
      const customer =
        await this.customerService.createCustomer(createCustomerDto);
      return new ResponData<Customer>(
        customer,
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponData<Customer>(
        null,
        HttpStatus.ERROR,
        HttpMessage.ERROR,
      );
    }
  }

  @Put(':id')
  async updateCustomer(
    @Param('id') id: number,
    @Body(new ValidationPipe()) updateCustomerDto: UpdateCustomerDto,
  ): Promise<ResponData<string>> {
    try {
      const response = await this.customerService.updateCustomer(
        id,
        updateCustomerDto,
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

  @Delete(':id')
  async deleteCustomer(@Param('id') id: number): Promise<ResponData<string>> {
    try {
      const response = await this.customerService.deleteCustomer(id);
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
