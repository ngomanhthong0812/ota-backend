import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { FloorService } from './floor.service';
import { CreateFloorDTO } from './dto/creatfloor.dot';
import { UpdateFloorDTO } from './dto/updatefloor.dto';

@Controller('floors')
export class FloorController {
  constructor(private readonly floorService: FloorService) {}

  @Post()
  create(@Body() createFloorDto: CreateFloorDTO) {
    return this.floorService.create(createFloorDto);
  }

  @Get()
  findAll() {
    return this.floorService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.floorService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateFloorDto: UpdateFloorDTO) {
    return this.floorService.update(id, updateFloorDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.floorService.remove(id);
  }

  @Get('rooms/total')
  async getTotalRoomCount() {
    const totalRooms = await this.floorService.getTotalRoomCount();
    return { total_rooms: totalRooms };
  }
}
