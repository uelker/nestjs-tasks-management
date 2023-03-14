import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { TaskStatus } from '../task-status.enum';

export class UpdateTaskDto {
  @IsEnum(TaskStatus)
  @ApiProperty({
    name: 'status',
    description: 'Status of the task',
    enum: TaskStatus,
  })
  status: TaskStatus;
}
