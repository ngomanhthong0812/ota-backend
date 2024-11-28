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
import { InvoiceItemService } from './invoiceItem.service';
import { HttpMessage, HttpStatus } from 'src/global/globalEnum';
import { ResponData } from 'src/global/globalClass';
import { CreateInvoiceItemDto } from './dto/createInvoiceItem.dto';
import { UpdateInvoiceItemDto } from './dto/updateInvoiceItem.dto';
import { InvoiceItem } from 'src/models/invoiceItem.model';

@Controller('invoiceItems')
export class InvoiceItemController {
  constructor(private readonly invoiceItemService: InvoiceItemService) {}

  @Get()
  async getInvoiceItems(): Promise<ResponData<InvoiceItem[]>> {
    try {
      return new ResponData<InvoiceItem[]>(
        await this.invoiceItemService.getInvoiceItems(),
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponData<InvoiceItem[]>(
        await this.invoiceItemService.getInvoiceItems(),
        HttpStatus.ERROR,
        HttpMessage.ERROR,
      );
    }
  }

  @Get(':id')
  async findOneInvoiceItem(
    @Param('id') id: number,
  ): Promise<ResponData<InvoiceItem>> {
    try {
      return new ResponData<InvoiceItem>(
        await this.invoiceItemService.findOneInvoiceItem(id),
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponData<InvoiceItem>(
        null,
        HttpStatus.ERROR,
        HttpMessage.ERROR,
      );
    }
  }

  @Post()
  async createInvoiceItem(
    @Body(new ValidationPipe()) createInvoiceItemDto: CreateInvoiceItemDto,
  ): Promise<ResponData<InvoiceItem>> {
    try {
      return new ResponData<InvoiceItem>(
        await this.invoiceItemService.createInvoiceItem(createInvoiceItemDto),
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponData<InvoiceItem>(
        null,
        HttpStatus.ERROR,
        HttpMessage.ERROR,
      );
    }
  }

  @Put()
  async updateInvoiceItem(
    @Body(new ValidationPipe()) updateInvoiceItemDto: UpdateInvoiceItemDto,
  ): Promise<ResponData<InvoiceItem>> {
    try {
      return new ResponData<InvoiceItem>(
        await this.invoiceItemService.updateInvoiceItem(updateInvoiceItemDto),
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponData<InvoiceItem>(
        null,
        HttpStatus.ERROR,
        HttpMessage.ERROR,
      );
    }
  }

  @Delete(':id')
  async deleteInvoiceItem(
    @Param('id') id: number,
  ): Promise<ResponData<string>> {
    try {
      return new ResponData<string>(
        await this.invoiceItemService.deleteInvoiceItem(id),
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponData<string>(null, HttpStatus.ERROR, HttpMessage.ERROR);
    }
  }
}
