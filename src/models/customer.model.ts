export class Customer {
  id?: number;
  birthday?: Date;
  phone?: string;
  email?: string;
  gender?: 'Male' | 'Female' | 'Other';
  hotel_id?: number;

  constructor(
    id: number,
    birthday: Date,
    phone: string,
    email: string,
    gender: 'Male' | 'Female' | 'Other',
    hotel_id: number,
  ) {
    if (id !== null) this.id = id;
    if (birthday !== null) this.birthday = birthday;
    if (phone !== null) this.phone = phone;
    if (email !== null) this.email = email;
    if (gender !== null) this.gender = gender;
    if (hotel_id !== null) this.hotel_id = hotel_id;
  }
}
