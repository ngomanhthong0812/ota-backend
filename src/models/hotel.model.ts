export class Hotel {
  id?: number;
  name?: string;
  address?: string;
  phone?: string;
  email?: string;

  constructor(
    id?: number,
    name?: string,
    address?: string,
    phone?: string,
    email?: string,
  ) {
    if (id !== null) this.id = id;
    if (name !== null) this.name = name;
    if (address !== null) this.address = address;
    if (phone !== null) this.phone = phone;
    if (email !== null) this.email = email;
  }
}
