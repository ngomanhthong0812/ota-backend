export class User {
  id?: number;
  user_name?: string;
  password?: string;
  email?: string;
  phone?: string;
  hotel_id?: number;
  role_id?: number;
  code?: string;
  isActive?: boolean;

  constructor(
    id: number,
    user_name: string,
    password: string,
    email: string,
    phone: string,
    hotel_id: number,
    role_id: number,
    code: string,
    isActive: boolean,
  ) {
    if (id !== null) this.id = id;
    if (user_name !== null) this.user_name = user_name;
    if (password !== null) this.password = password;
    if (email !== null) this.email = email;
    if (phone !== null) this.phone = phone;
    if (hotel_id !== null) this.hotel_id = hotel_id;
    if (role_id !== null) this.role_id = role_id;
    if (code !== null) this.code = code;
    if (isActive !== null) this.isActive = isActive;
  }
}
