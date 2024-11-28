import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { CreateTransactionDto } from './dto/createTransaction.dto';
import { JwtAuthGuard } from 'src/auth/passport/jwt-auth.guard';
import { GetUser } from 'src/decorator/user.decorator';
import { ResponData } from 'src/global/globalClass';
import { HttpMessage, HttpStatus } from 'src/global/globalEnum';
import { TransactionService } from './transaction.service';
import { UpdateTransactionDto } from './dto/updateTransaction .dto';
import { TransactionEntity } from 'src/entities/transaction.entity';

@Controller('transaction')
export class TransactionController {
  constructor(private readonly TransactionService: TransactionService) {}

  //------------------------------------------------------
  @Post('create/income')
  @UseGuards(JwtAuthGuard) // Sử dụng bảo mật JWT
  async createIncomeTransaction(
    @Body(new ValidationPipe()) dto: CreateTransactionDto,
    @GetUser()
    user: any,
  ) {
    try {
      const id = user._id;
      console.log(id);
      const result = await this.TransactionService.createTransactionCash(
        dto,
        id,
        'income',
      );

      return new ResponData(
        result,
        HttpStatus.SUCCESS,
        'Tạo phiếu thu thành công',
      );
    } catch (error) {}
  }
  //------------------------------------------------------
  @Post('create/expense')
  @UseGuards(JwtAuthGuard) // Sử dụng bảo mật JWT
  async createExpenseTransaction(
    @Body(new ValidationPipe()) dto: CreateTransactionDto,
    @GetUser()
    user: any,
  ) {
    try {
      const id = user._id;
      console.log(id);
      const result = await this.TransactionService.createTransactionCash(
        dto,
        id,
        'expense',
      );

      return new ResponData(
        result,
        HttpStatus.SUCCESS,
        'Tạo phiếu chi thành công',
      );
    } catch (error) {}
  }
  //----------------------------------------------------
  @Get('cash')
  @UseGuards(JwtAuthGuard)
  async getCashTransactionsByHotelId(
    @GetUser()
    user: any,
    @Query('page') page: number = 1,
  ) {
    try {
      const id = user._id;
      console.log(page);
      const result = await this.TransactionService.getCashTransactions(
        id,
        'cash',
        page,
      );

      return new ResponData(
        result,
        HttpStatus.SUCCESS,
        'Tạo phiếu chi thành công',
      );
    } catch (error) {}
  }
  @Get('bank')
  @UseGuards(JwtAuthGuard)
  async getBankTransactionsByHotelId(
    @GetUser()
    user: any,
    @Query('page') page: number = 1,
  ) {
    try {
      const id = user._id;
      console.log(id);
      const result = await this.TransactionService.getBankTransactions(
        id,
        page,
        8,
        'bank',
      );

      return new ResponData(result, HttpStatus.SUCCESS, 'Láy thành công bank');
    } catch (error) {}
  }
  //----------------------------------------------------
  // Lấy chi tiết thu/chi và so sánh
  @Get('details/cash')
  @UseGuards(JwtAuthGuard)
  async getCashTransactionDetails(
    @GetUser()
    user: any,
    @Query('page') page: number = 1,
  ) {
    try {
      const id = user._id;

      console.log(id);
      const result = await this.TransactionService.getTransactionDetails(
        id,
        page,
        8,
        'cash',
      );

      return new ResponData(result, HttpStatus.SUCCESS, ' thành công');
    } catch (error) {}
  }
  @Get('details/bank')
  @UseGuards(JwtAuthGuard)
  async getBankTransactionDetails(
    @GetUser()
    user: any,
    @Query('page') page: number = 1,
  ) {
    try {
      const id = user._id;

      console.log(id);
      const result = await this.TransactionService.getTransactionDetails(
        id,
        page,
        8,
        'bank',
      );

      return new ResponData(result, HttpStatus.SUCCESS, ' thành công');
    } catch (error) {}
  }
  //----------------------------------------------
  @Delete(':id')
  async deleteTransaction(@Param('id') id: number): Promise<any> {
    try {
      const result = this.TransactionService.deleteTransaction(id);
      return new ResponData(result, HttpStatus.SUCCESS, `Xóa thành công ${id}`);
    } catch (error) {}
  }
  // -------------------------------------------------
  @Put(':id')
  async updateTransaction(
    @Param('id') id: number,
    @Body() updateDto: UpdateTransactionDto,
  ): Promise<any> {
    try {
      try {
        const result = await this.TransactionService.updateTransaction(
          id,
          updateDto,
        );
        return new ResponData(
          result,
          HttpStatus.SUCCESS,
          `Update thành công id: ${id}`,
        );
      } catch (error) {}
    } catch (error) {}
  }
  //--------------------------------------------------
  // lấy 1 thông tin
  @Get(':id')
  async getTransactionById(@Param('id', ParseIntPipe) id: number) {
    try {
      // Gọi hàm trong service để lấy thông tin phiếu
      const transactionDetails =
        await this.TransactionService.getTransactionDetailsById(id);

      // Trả về dữ liệu phiếu
      return new ResponData(
        transactionDetails,
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      // Xử lý lỗi
      return new ResponData(null, HttpStatus.ERROR, HttpMessage.ERROR);
    }
  }
}
