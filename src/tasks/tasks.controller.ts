import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { FetchTasksQueryDto } from './dto/fetch-tasks-query.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './task-model';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  fetchTasks(@Query() filter: FetchTasksQueryDto): Task[] {
    if (filter.search || filter.status) {
      return this.tasksService.fetchTasksWithFilter(filter);
    }
    return this.tasksService.fetchAllTasks();
  }

  @Get(':id')
  fetchTaskById(@Param('id') id: string): Task {
    return this.tasksService.fetchTaskById(id);
  }

  @Post()
  createTask(@Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.createTask(createTaskDto);
  }

  @Patch(':id')
  updateTask(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return this.tasksService.updateTask(id, updateTaskDto);
  }

  @Delete(':id')
  deleteTask(@Param('id') id: string) {
    this.tasksService.deleteTaskById(id);
  }
}
