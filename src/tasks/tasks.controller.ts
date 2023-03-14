import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CreateTaskDto } from './dto/create-task.dto';
import { FetchTasksQueryDto } from './dto/fetch-tasks-query.dto';
import { ResponseTaskDto } from './dto/response-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TasksService } from './tasks.service';

@Controller('tasks')
@ApiTags('Tasks API')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  @ApiOperation({ summary: 'Fetch all tasks' })
  @ApiOkResponse({ type: [ResponseTaskDto] })
  fetchTasks(@Query() filter: FetchTasksQueryDto): Promise<ResponseTaskDto[]> {
    if (filter.search || filter.status) {
      return this.tasksService.fetchTasksWithFilter(filter);
    }
    return this.tasksService.fetchAllTasks();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Fetch task by id' })
  @ApiOkResponse({ type: ResponseTaskDto })
  @ApiNotFoundResponse({ description: 'Task not found' })
  @ApiBadRequestResponse({ description: 'Invalid id' })
  fetchTaskById(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ResponseTaskDto> {
    return this.tasksService.fetchTaskById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new task' })
  @ApiOkResponse({ type: ResponseTaskDto })
  createTask(@Body() createTaskDto: CreateTaskDto): Promise<ResponseTaskDto> {
    return this.tasksService.createTask(createTaskDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a task' })
  @ApiOkResponse({ description: 'Task updated successfully' })
  @ApiNotFoundResponse({ description: 'Task not found' })
  @ApiBadRequestResponse({ description: 'Invalid id' })
  updateTask(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ): Promise<void> {
    return this.tasksService.updateTask(id, updateTaskDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a task' })
  @ApiOkResponse({ description: 'Task deleted successfully' })
  @ApiNotFoundResponse({ description: 'Task not found' })
  @ApiBadRequestResponse({ description: 'Invalid id' })
  deleteTask(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.tasksService.deleteTaskById(id);
  }
}
