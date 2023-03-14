import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { TaskStatus } from '../task-status.enum';

export class FetchTasksQueryDto {
  @ApiProperty({
    name: 'status',
    description: 'Status of the task',
    enum: TaskStatus,
    required: false,
  })
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @ApiProperty({
    name: 'search',
    description: 'Search in title & description',
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  search?: string;
}
