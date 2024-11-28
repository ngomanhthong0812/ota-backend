import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/createCategory.dto';
import { UpdateCategoryDto } from './dto/updateCategory.dto';
import { CategoryEntity } from 'src/entities/category.entity';
import { Category } from 'src/models/category.model';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
  ) {}

  async getCategories(): Promise<Category[]> {
    const categories = await this.categoryRepository.find();
    return categories.map(
      (category) =>
        new Category(category.id, category.name, category.description),
    );
  }

  async findOneCategory(id: number): Promise<Category> {
    const category = await this.categoryRepository.findOne({ where: { id } });
    return new Category(category.id, category.name, category.description);
  }

  async createCategory(
    createCategoryDto: CreateCategoryDto,
  ): Promise<Category> {
    const category = new Category();
    category.name = createCategoryDto.name;
    category.description = createCategoryDto.description;

    await this.categoryRepository.save(category);
    return new Category(category.id, category.name, category.description);
  }

  async updateCategory(
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    const { id, ...updateCategoryData } = updateCategoryDto;

    await this.categoryRepository.update(id, updateCategoryData);

    const category = await this.categoryRepository.findOne({ where: { id } });
    return new Category(category.id, category.name, category.description);
  }

  async deleteCategory(id: number): Promise<string> {
    await this.categoryRepository.delete(id);
    return `Delete category ${id} success`;
  }
}
