import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTaskDto {
  @ApiProperty({
    name: 'description',
    description: 'Description of the task',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    name: 'title',
    description: 'Title of the task',
  })
  @IsString()
  @IsNotEmpty()
  title: string;
}
