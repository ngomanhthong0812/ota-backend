import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  ValidationPipe,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { HttpMessage, HttpStatus } from 'src/global/globalEnum';
import { ResponData } from 'src/global/globalClass';
import { CreateCategoryDto } from './dto/createCategory.dto';
import { UpdateCategoryDto } from './dto/updateCategory.dto';
import { Category } from 'src/models/category.model';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  async getCategories(): Promise<ResponData<Category[]>> {
    try {
      return new ResponData<Category[]>(
        await this.categoryService.getCategories(),
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponData<Category[]>(
        await this.categoryService.getCategories(),
        HttpStatus.ERROR,
        HttpMessage.ERROR,
      );
    }
  }

  @Get(':id')
  async findOneCategory(
    @Param('id') id: number,
  ): Promise<ResponData<Category>> {
    try {
      return new ResponData<Category>(
        await this.categoryService.findOneCategory(id),
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponData<Category>(
        null,
        HttpStatus.ERROR,
        HttpMessage.ERROR,
      );
    }
  }

  @Post()
  async createCategory(
    @Body(new ValidationPipe()) createCategoryDto: CreateCategoryDto,
  ): Promise<ResponData<Category>> {
    try {
      return new ResponData<Category>(
        await this.categoryService.createCategory(createCategoryDto),
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponData<Category>(
        null,
        HttpStatus.ERROR,
        HttpMessage.ERROR,
      );
    }
  }

  @Put()
  async updateCategory(
    @Body(new ValidationPipe()) updateCategoryDto: UpdateCategoryDto,
  ): Promise<ResponData<Category>> {
    try {
      return new ResponData<Category>(
        await this.categoryService.updateCategory(updateCategoryDto),
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponData<Category>(
        null,
        HttpStatus.ERROR,
        HttpMessage.ERROR,
      );
    }
  }

  @Delete(':id')
  async deleteCategory(@Param('id') id: number): Promise<ResponData<string>> {
    try {
      return new ResponData<string>(
        await this.categoryService.deleteCategory(id),
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponData<string>(null, HttpStatus.ERROR, HttpMessage.ERROR);
    }
  }
}
