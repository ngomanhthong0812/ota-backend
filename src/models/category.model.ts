export class Category {
  id?: number;
  name?: string;
  description?: string;

  constructor(id?: number, name?: string, description?: string) {
    if (id !== null) this.id = id;
    if (name !== null) this.name = name;
    if (description !== null) this.description = description;
  }
}
