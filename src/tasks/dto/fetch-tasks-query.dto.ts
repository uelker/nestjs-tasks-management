import { IsEnum, IsOptional, IsString } from 'class-validator';
import { TaskStatus } from '../task-model';

export class FetchTasksQueryDto {
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @IsOptional()
  @IsString()
  search?: string;
}
