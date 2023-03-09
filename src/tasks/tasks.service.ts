import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { FetchTasksQueryDto } from './dto/fetch-tasks-query.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task, TaskStatus } from './task-model';
import { v4 as uuid } from 'uuid';
@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  fetchAllTasks(): Task[] {
    return this.tasks;
  }

  fetchTaskById(id: string): Task {
    return this.tasks.find((task) => task.id === id);
  }

  createTask({ title, description }: CreateTaskDto): Task {
    const task: Task = {
      id: uuid(),
      title,
      description,
      status: TaskStatus.OPEN,
    };

    this.tasks.push(task);
    return task;
  }

  deleteTaskById(id: string): void {
    this.tasks = this.tasks.filter((task) => task.id !== id);
  }

  updateTask(id: string, updateTaskDto: UpdateTaskDto) {
    const task = this.fetchTaskById(id);
    task.status = updateTaskDto.status;
    return task;
  }

  fetchTasksWithFilter({ status, search }: FetchTasksQueryDto): Task[] {
    let tasks = this.fetchAllTasks();

    if (status) {
      tasks = tasks.filter((task) => task.status === status);
    }

    if (search) {
      tasks = tasks.filter(
        (task) =>
          task.title.toLowerCase().includes(search) ||
          task.description.toLowerCase().includes(search),
      );
    }

    return tasks;
  }
}
