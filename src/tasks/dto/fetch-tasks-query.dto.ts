import { TaskStatus } from '../task-model';

export class FetchTasksQueryDto {
  status?: TaskStatus;
  search?: string;
}
