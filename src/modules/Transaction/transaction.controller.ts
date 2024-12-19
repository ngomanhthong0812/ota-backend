import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Res,
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
import { Response } from 'express'; // Import Response từ Express
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
  @Get('bank')
  @UseGuards(JwtAuthGuard)
  async getBankTransactionsByHotelId(
    @GetUser() user: any,
    @Query('type') type?: 'income' | 'expense',
    @Query('dateRange') dateRange?: string,
    @Query('fromDate') fromDate?: string,
    @Query('toDate') toDate?: string,
    @Query('page', ParseIntPipe) page: number = 1, // Giá trị mặc định là 1
  ) {
    try {
      const userId = user._id;
      console.log(userId);

      // Gọi phương thức dịch vụ với các tham số từ người dùng
      const result = await this.TransactionService.getBankTransactions(
        userId,
        type,
        dateRange,
        fromDate,
        toDate,
        page,
        8,
      );

      // Trả về dữ liệu theo định dạng cần thiết
      return new ResponData(
        result,
        HttpStatus.SUCCESS,
        'Lấy thành công các giao dịch ngân hàng',
      );
    } catch (error) {
      // Xử lý lỗi nếu có
      console.error(error);
      throw new Error('Không thể lấy giao dịch ngân hàng');
    }
  }

  //----------------------------------------------------
  // Lấy chi tiết thu/chi và so sánh
  @Get('details/cash')
  @UseGuards(JwtAuthGuard)
  async getCashTransactionDetails(
    @GetUser() user: any,
    @Query('page') page: number = 1,
    @Query('fromDate') fromDate?: string, // Thêm tham số từ ngày
    @Query('toDate') toDate?: string, // Thêm tham số đến ngày
  ) {
    try {
      const id = user._id; // Lấy ID người dùng

      console.log(id);
      console.log('From Date:', fromDate);
      console.log('To Date:', toDate);

      // Gọi dịch vụ để lấy dữ liệu giao dịch tiền mặt với các tham số từ ngày và đến ngày
      const result = await this.TransactionService.getTransactionDetails(
        id,
        page,
        8, // Giới hạn 8 giao dịch mỗi trang
        'cash', // Loại giao dịch là 'cash'
        fromDate, // Truyền tham số fromDate vào dịch vụ
        toDate, // Truyền tham số toDate vào dịch vụ
      );

      // Trả về kết quả
      return new ResponData(result, HttpStatus.SUCCESS, 'Thành công');
    } catch (error) {
      console.error(error);
      // Xử lý lỗi và trả về phản hồi thất bại
      return new ResponData(
        null,
        HttpStatus.ERROR,
        'Có lỗi xảy ra trong quá trình lấy dữ liệu',
      );
    }
  }
  @Get('details/bank')
  @UseGuards(JwtAuthGuard)
  async getBankTransactionDetails(
    @GetUser()
    user: any,
    @Query('page') page: number = 1,
    @Query('fromDate') fromDate?: string, // Thêm tham số từ ngày
    @Query('toDate') toDate?: string, // Thêm tham số đến ngày
  ) {
    try {
      const id = user._id;

      console.log(id);
      const result = await this.TransactionService.getTransactionDetails(
        id,
        page,
        8,
        'bank',
        fromDate,
        toDate,
      );

      return new ResponData(result, HttpStatus.SUCCESS, ' thành công');
    } catch (error) {}
  }
  //----------------------------------------------
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteTransaction(
    @Param('id') id: number,
    @GetUser()
    user: any,
  ): Promise<any> {
    try {
      const user_id = user._id;
      const result = await this.TransactionService.deleteTransaction(
        id,
        user_id,
      );
      return new ResponData(result, HttpStatus.SUCCESS, `Xóa thành công ${id}`);
    } catch (error) {
      return new ResponData(null, HttpStatus.ERROR, ` ${error.message}`);
    }
  }
  // -------------------------------------------------
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async updateTransaction(
    @Param('id') id: number,
    @Body() updateDto: UpdateTransactionDto,
    @GetUser()
    user: any,
  ): Promise<any> {
    try {
      try {
        const user_id = user._id;
        const result = await this.TransactionService.updateTransaction(
          id,
          updateDto,
          user_id,
        );
        return new ResponData(
          result,
          HttpStatus.SUCCESS,
          `Update thành công id: ${id}`,
        );
      } catch (error) {}
    } catch (error) {
      return new ResponData(null, HttpStatus.ERROR, error.message);
    }
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
  // -----------------------------------------------------------
  @UseGuards(JwtAuthGuard)
  @Get('cash_fund/cash_fund')
  async getCashTransactions(
    @GetUser()
    user: any,
    @Query('type') type?: 'income' | 'expense',
    @Query('dateRange') dateRange?: string,
    @Query('fromDate') fromDate?: string,
    @Query('toDate') toDate?: string,
    @Query('page', ParseIntPipe) page: number = 1, // Giá trị mặc định là 1
  ): Promise<any> {
    const limit = 8;
    // Kiểm tra các tham số page và limit
    if (isNaN(page) || page < 1) {
      throw new BadRequestException('Invalid page parameter');
    }
    if (isNaN(limit) || limit < 1) {
      throw new BadRequestException('Invalid limit parameter');
    }

    const userId = user._id;

    const transactionDetails =
      await this.TransactionService.getCashhTransactions(
        userId,
        type,
        dateRange,
        fromDate,
        toDate,
        page,
        limit,
      );
    return new ResponData(
      transactionDetails,
      HttpStatus.SUCCESS,
      HttpMessage.SUCCESS,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('/file/transactionsexcel')
  async exportTransactionDetails(
    @Res() res: Response,
    @Query('type') type: string,
    @GetUser()
    user: any,
  ): Promise<void> {
    try {
      const userId = user._id;
      const buffer = await this.TransactionService.exportTransactionDetails(
        res,
        userId,
        type,
      );

      // Thiết lập các header trước khi gửi dữ liệu
      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );
      res.setHeader(
        'Content-Disposition',
        `attachment; filename=transactions_${type}_${new Date().toISOString()}.xlsx`,
      );

      // Gửi file Excel dưới dạng buffer
      res.send(buffer); // Chỉ gọi res.send một lần
    } catch (error) {
      console.error('Error exporting transactions:', error);
      res.status(500).send('Error exporting transactions');
    }
  }

  @Get('hotel/:hotelId')
  async getTransactionsByHotel(@Param('hotelId') hotelId: number) {
    try {
      const getTransactionsByHotel =
        await this.TransactionService.getTransactionsByHotel(hotelId);
      return new ResponData(
        getTransactionsByHotel,
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponData(null, HttpStatus.SUCCESS, HttpMessage.SUCCESS);
    }
  }
}
