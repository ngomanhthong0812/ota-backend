import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { RoleEntity } from './entities/role.entity';
import { UserEntity } from './entities/user.entity';
import { RoomTypeEntity } from './entities/roomType.entity';
import { RoomEntity } from './entities/room.entity';
import { BookingRoomEntity } from './entities/bookingRoom.entity';
import { BookingEntity } from './entities/booking.entity';
import { CustomerEntity } from './entities/customer.entity';
import { InvoiceEntity } from './entities/invoice.entity';
import { UserModule } from './modules/users/user.module';
import { BookingModule } from './modules/bookings/booking.module';
import { BookingRoomModule } from './modules/bookingrooms/bookingroom.module';
import { HotelEntity } from './entities/hotel.entity';
import { RoomTypeModule } from './modules/room-type/roomType.module';
import { RoomModule } from './modules/room/room.module';
import { RoleModule } from './modules/roles/role.module';
import { HotelModule } from './modules/hotels/hotel.module';
import { CustomerModule } from './modules/customers/customer.module';
import { InvoiceModule } from './modules/invoice/invoice.module';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/passport/jwt-auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { FloorEntity } from './entities/floor.entity';
import { TransactionEntity } from './entities/transaction.entity';
import { BankTransactionEntity } from './entities/bankTransaction.entity';
import { CashTransactionEntity } from './entities/cashTransaction.entity';
import { TransactionModule } from './modules/Transaction/transaction.module';
import { FloorModule } from './modules/floor/floor.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT) || 3306,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [
        HotelEntity,
        RoleEntity,
        UserEntity,
        RoomTypeEntity,
        RoomEntity,
        BookingRoomEntity,
        CustomerEntity,
        BookingEntity,
        InvoiceEntity,
        FloorEntity,
        TransactionEntity,
        BankTransactionEntity,
        CashTransactionEntity,
      ],
      synchronize: true,
    }),
    MailerModule.forRootAsync({
      useFactory: () => ({
        transport: {
          host: process.env.MAILDEV_HOST,
          port: Number(process.env.MAILDEV_PORT),
          ignoreTLS: true,
          secure: true,
          auth: {
            user: process.env.MAILDEV_INCOMING_USER,
            pass: process.env.MAILDEV_INCOMING_PASS,
          },
        },
        defaults: {
          from: '"No Reply" <no-reply@localhost>',
        },
        // preview: true,
        template: {
          dir: process.cwd() + '/src/mail/templates/',
          adapter: new HandlebarsAdapter(), // or new PugAdapter() or new EjsAdapter()
          options: {
            strict: true,
          },
        },
      }),
    }),
    HotelModule,
    RoleModule,
    UserModule,
    RoomTypeModule,
    RoomModule,
    BookingModule,
    BookingRoomModule,
    AuthModule,
    CustomerModule,
    InvoiceModule,
    TransactionModule,
    FloorModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
