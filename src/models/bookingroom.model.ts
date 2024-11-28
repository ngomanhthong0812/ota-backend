export class BookingRoom {
  id?: number;
  price?: number;
  booking_id?: number;
  room_id?: number;
  hotel_id?: number;

  constructor(
    id: number,
    price: number,
    booking_id: number,
    room_id: number,
    hotel_id: number,
  ) {
    if (id !== null) this.id = id;
    if (price !== null) this.price = price;
    if (booking_id !== null) this.booking_id = booking_id;
    if (room_id !== null) this.room_id = room_id;
    if (hotel_id !== null) this.hotel_id = hotel_id;
  }
}
