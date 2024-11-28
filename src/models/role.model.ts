export class Role {
  id?: number;
  name?: string;
  description?: string;
  hotel_id?: number;

  constructor(
    id?: number,
    name?: string,
    description?: string,
    hotel_id?: number,
  ) {
    if (id !== null) this.id = id;
    if (name !== null) this.name = name;
    if (description !== null) this.description = description;
    if (hotel_id !== null) this.hotel_id = hotel_id;
  }
}
