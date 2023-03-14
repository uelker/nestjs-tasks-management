import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { TaskStatus } from '../task-status.enum';

@Exclude()
export class ResponseTaskDto {
  @ApiProperty({
    name: 'id',
    description: 'Id of the task',
  })
  @Expose()
  id: string;

  @ApiProperty({
    name: 'title',
    description: 'Title of the task',
  })
  @Expose()
  title: string;

  @ApiProperty({
    name: 'description',
    description: 'Description of the task',
  })
  @Expose()
  description: string;

  @ApiProperty({
    name: 'status',
    description: 'Status of the task',
    enum: TaskStatus,
  })
  @Expose()
  status: TaskStatus;
}
